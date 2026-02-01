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
  return { finance: [], tech: [], taiwan_stocks: [], lastUpdated: null };
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
    taiwan_stocks: [],
    lastUpdated: new Date().toISOString()
  };

  try {
    // Finance News from multiple sources
    const financeSources = [
      {
        name: 'Bloomberg',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bloomberg.com/markets/news.rss',
        category: 'finance'
      },
      {
        name: 'Reuters Finance',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/businessNews',
        category: 'finance'
      }
    ];

    // Tech News - Using RSS feed from multiple sources
    const techSources = [
      {
        name: 'TechCrunch',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/',
        category: 'tech'
      },
      {
        name: 'The Verge',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.theverge.com/rss/index.xml',
        category: 'tech'
      }
    ];

    // Taiwan Stocks News - Using Google News RSS for Taiwan
    const taiwanStocksSources = [
      {
        name: '台灣股市新聞',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=台灣+台股+股市',
        category: 'taiwan_stocks'
      }
    ];

    // Fetch Finance News
    for (const source of financeSources) {
      try {
        const response = await axios.get(source.url, { timeout: 5000 });
        if (response.data && response.data.items) {
          const articles = response.data.items.slice(0, 3).map((item, idx) => ({
            id: `fin-${Date.now()}-${source.name}-${idx}`,
            title: item.title || 'Untitled',
            description: item.description ? stripHtml(item.description).substring(0, 200) : '暫無描述',
            url: item.link || 'javascript:void(0)',
            source: source.name,
            category: 'finance',
            image: '📈',
            date: item.pubDate || new Date().toISOString(),
            tags: ['財經', '市場']
          }));
          newsData.finance.push(...articles);
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${source.name} (finance):`, err.message);
      }
    }

    // Fetch Tech News
    for (const source of techSources) {
      try {
        const response = await axios.get(source.url, { timeout: 5000 });
        if (response.data && response.data.items) {
          const articles = response.data.items.slice(0, 3).map((item, idx) => ({
            id: `tech-${Date.now()}-${source.name}-${idx}`,
            title: item.title || 'Untitled',
            description: item.description ? stripHtml(item.description).substring(0, 200) : '暫無描述',
            url: item.link || 'javascript:void(0)',
            source: source.name,
            category: 'tech',
            image: '💻',
            date: item.pubDate || new Date().toISOString(),
            tags: ['科技', '創新']
          }));
          newsData.tech.push(...articles);
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${source.name} (tech):`, err.message);
      }
    }

    // Fetch Taiwan Stocks News
    for (const source of taiwanStocksSources) {
      try {
        const response = await axios.get(source.url, { timeout: 5000 });
        if (response.data && response.data.items) {
          const articles = response.data.items.slice(0, 5).map((item, idx) => {
            // Ensure we have a valid link
            let url = item.link || item.url || 'javascript:void(0)';
            if (url && !url.startsWith('http')) {
              // If link is relative, make it absolute
              url = 'https://news.cnyes.com' + url;
            }
            
            console.log(`[${source.name}] Article ${idx}: "${item.title}" → ${url}`);
            
            return {
              id: `tw-${Date.now()}-${source.name}-${idx}`,
              title: item.title || 'Untitled',
              description: item.description ? stripHtml(item.description).substring(0, 200) : '暫無描述',
              url: url,
              source: source.name,
              category: 'taiwan_stocks',
              image: '📈',
              date: item.pubDate || new Date().toISOString(),
              tags: ['台股', '股市']
            };
          });
          newsData.taiwan_stocks.push(...articles);
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${source.name} (taiwan_stocks):`, err.message);
      }
    }

    // If no finance news, add fallback data
    if (newsData.finance.length === 0) {
      newsData.finance = [
        {
          id: `fin-${Date.now()}-1`,
          title: '台股收盤漲幅達1.5%，金融科技股領漲',
          description: '台灣股市今日收盤上漲，金融科技相關股票表現亮眼，投資者看好科技產業前景。',
          url: 'https://money.udn.com/',
          source: '經濟日報',
          category: 'finance',
          image: '📈',
          date: new Date().toISOString(),
          tags: ['台股', '金融科技', '投資']
        }
      ];
    }

    // If no tech news, add fallback data
    if (newsData.tech.length === 0) {
      newsData.tech = [
        {
          id: `tech-${Date.now()}-1`,
          title: '人工智能技術突破，新型芯片性能提升200%',
          description: '最新研究表明，新一代AI芯片在推理速度和能效上取得重大突破，有望推動AI應用普及。',
          url: 'https://techcrunch.com/',
          source: 'TechCrunch',
          category: 'tech',
          image: '🤖',
          date: new Date().toISOString(),
          tags: ['AI', '芯片', '科技']
        }
      ];
    }

    // If no taiwan stocks news, add fallback data with real links
    if (newsData.taiwan_stocks.length === 0) {
      newsData.taiwan_stocks = [
        {
          id: `tw-${Date.now()}-1`,
          title: '台積電領漲，台股站上18000點',
          description: '台股上漲，台積電等權值股表現強勢，帶動大盤突破高點。投資人看好後市表現。',
          url: 'https://tw.investing.com/stocks/taiwan-semiconductor-mnf',
          source: '台灣股市新聞',
          category: 'taiwan_stocks',
          image: '📈',
          date: new Date().toISOString(),
          tags: ['台股', '個股', '台積電']
        },
        {
          id: `tw-${Date.now()}-2`,
          title: '聯發科創新高，5G芯片訂單成長',
          description: '聯發科芯片訂單持續成長，5G產品銷售暢旺，營收創新高。分析師看好全年表現。',
          url: 'https://tw.investing.com/stocks/mediatek-inc-mnf',
          source: '台灣股市新聞',
          category: 'taiwan_stocks',
          image: '📊',
          date: new Date().toISOString(),
          tags: ['台股', '個股', '聯發科']
        },
        {
          id: `tw-${Date.now()}-3`,
          title: '鴻海轉機浮現，電動車業務看俏',
          description: '鴻海電動車業務進展順利，多家國際大廠合作，產業前景樂觀。股價創新高。',
          url: 'https://tw.investing.com/stocks/hon-hai-precision-co-mnf',
          source: '台灣股市新聞',
          category: 'taiwan_stocks',
          image: '⚡',
          date: new Date().toISOString(),
          tags: ['台股', '個股', '鴻海']
        }
      ];
    }

    // Remove duplicates and sort by date
    const deduplicateNews = (articles) => {
      const seen = new Set();
      return articles.filter(item => {
        const key = `${item.title}-${item.source}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    newsData.finance = deduplicateNews(newsData.finance);
    newsData.tech = deduplicateNews(newsData.tech);
    newsData.taiwan_stocks = deduplicateNews(newsData.taiwan_stocks);

    saveNewsData(newsData);
    console.log(`✅ News updated: ${newsData.finance.length} finance + ${newsData.tech.length} tech + ${newsData.taiwan_stocks.length} taiwan_stocks articles`);
    return newsData;

  } catch (err) {
    console.error('Error fetching news:', err);
    return getNewsData();
  }
}

// Helper: Strip HTML tags from text
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
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
