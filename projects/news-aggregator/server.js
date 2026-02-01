const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, 'news-data.json');
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions
function getNewsData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading news data:', err);
  }
  return { finance: [], tech: [], lastUpdated: null };
}

function saveNewsData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving news data:', err);
  }
}

// Fetch news from multiple sources
async function fetchNews() {
  console.log('🔄 Fetching latest news...');
  
  const newsData = {
    finance: [],
    tech: [],
    lastUpdated: new Date().toISOString()
  };

  try {
    // Tech News - Using RSS feed from HN/Tech sources
    const techSources = [
      {
        name: 'TechCrunch Headlines',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/',
        category: 'tech'
      }
    ];

    // Finance News - Using mock data for now
    // In production, use financial APIs like Alpha Vantage, IEX Cloud, etc.
    const financeNews = [
      {
        id: `fin-${Date.now()}-1`,
        title: '台股收盤漲幅達1.5%，金融科技股領漲',
        description: '台灣股市今日收盤上漲，金融科技相關股票表現亮眼，投資者看好科技產業前景。',
        url: '#',
        source: '財經新聞',
        category: 'finance',
        image: '📈',
        date: new Date().toISOString(),
        tags: ['台股', '金融科技', '投資']
      },
      {
        id: `fin-${Date.now()}-2`,
        title: '美元兌台幣升至32.5，央行關注匯率動向',
        description: '美元對台幣匯率持續升值，央行表示將密切關注市場動向以維持匯率穩定。',
        url: '#',
        source: '外匯市場',
        category: 'finance',
        image: '💱',
        date: new Date().toISOString(),
        tags: ['外匯', '匯率', '美元']
      }
    ];

    newsData.finance = financeNews;

    // Fetch from RSS2JSON service
    for (const source of techSources) {
      try {
        const response = await axios.get(source.url, { timeout: 5000 });
        if (response.data && response.data.items) {
          const articles = response.data.items.slice(0, 5).map((item, idx) => ({
            id: `tech-${Date.now()}-${idx}`,
            title: item.title || 'Untitled',
            description: item.description ? item.description.substring(0, 200) : '',
            url: item.link || '#',
            source: source.name,
            category: 'tech',
            image: '💻',
            date: item.pubDate || new Date().toISOString(),
            tags: ['Technology', 'Innovation']
          }));
          newsData.tech.push(...articles);
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${source.name}:`, err.message);
        // Add default tech news if fetch fails
        newsData.tech.push(
          {
            id: `tech-${Date.now()}-default-1`,
            title: '人工智能技術突破，新型芯片性能提升200%',
            description: '最新研究表明，新一代AI芯片在推理速度和能效上取得重大突破，有望推動AI應用普及。',
            url: '#',
            source: '科技新聞',
            category: 'tech',
            image: '🤖',
            date: new Date().toISOString(),
            tags: ['AI', '芯片', '科技']
          },
          {
            id: `tech-${Date.now()}-default-2`,
            title: '雲計算市場競爭加劇，新興廠商快速成長',
            description: '雲服務市場增速放緩，但邊緣計算和混合雲解決方案成為新增長點，吸引多家企業投資。',
            url: '#',
            source: '科技產業',
            category: 'tech',
            image: '☁️',
            date: new Date().toISOString(),
            tags: ['雲計算', '邊緣計算', '企業']
          }
        );
      }
    }

    // Remove duplicates and sort by date
    newsData.finance = [...new Map(newsData.finance.map(item => [item.id, item])).values()]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    newsData.tech = [...new Map(newsData.tech.map(item => [item.id, item])).values()]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    saveNewsData(newsData);
    console.log(`✅ News updated: ${newsData.finance.length} finance + ${newsData.tech.length} tech articles`);
    return newsData;

  } catch (err) {
    console.error('Error fetching news:', err);
    return getNewsData();
  }
}

// Routes
app.get('/api/news', (req, res) => {
  const newsData = getNewsData();
  res.json(newsData);
});

app.get('/api/news/:category', (req, res) => {
  const { category } = req.params;
  const newsData = getNewsData();
  
  if (category === 'finance' || category === 'tech') {
    res.json({
      category,
      articles: newsData[category] || [],
      lastUpdated: newsData.lastUpdated
    });
  } else {
    res.status(400).json({ error: 'Invalid category. Use "finance" or "tech"' });
  }
});

// Manual refresh endpoint
app.post('/api/news/refresh', async (req, res) => {
  try {
    const newsData = await fetchNews();
    res.json({ success: true, newsData });
  } catch (err) {
    console.error('Error refreshing news:', err);
    res.status(500).json({ error: 'Failed to refresh news' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const codespaceUrl = `https://reimagined-space-robot-w44756rjvpp35xxj-${PORT}.app.github.dev`;
  console.log(`✅ News Aggregator running at http://localhost:${PORT}`);
  console.log(`   Codespace URL: ${codespaceUrl}`);
  console.log(`   Home: ${codespaceUrl}/`);
  
  // Fetch initial news
  setTimeout(() => fetchNews(), 1000);
});

module.exports = app;
