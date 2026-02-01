const API_URL = '/api/news';

let allNews = { finance: [], tech: [] };
let currentCategory = 'all';

// DOM Elements
const newsGrid = document.getElementById('newsGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdate = document.getElementById('lastUpdate');
const tabBtns = document.querySelectorAll('.tab-btn');

// Event Listeners
refreshBtn.addEventListener('click', handleRefresh);
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => handleCategoryChange(btn.dataset.category));
});

// Initialize
loadNews();

// Functions
async function loadNews() {
  showLoading(true);
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    allNews = data;
    updateLastUpdateTime();
    renderNews();
  } catch (err) {
    console.error('Error loading news:', err);
    showError('無法加載新聞，請稍後重試');
  } finally {
    showLoading(false);
  }
}

async function handleRefresh() {
  refreshBtn.disabled = true;
  refreshBtn.textContent = '⏳ 更新中...';
  
  try {
    const response = await fetch('/api/news/refresh', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      allNews = result.newsData;
      updateLastUpdateTime();
      renderNews();
      alert('✅ 新聞已更新！');
    }
  } catch (err) {
    console.error('Error refreshing news:', err);
    alert('❌ 更新失敗，請稍後重試');
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = '🔄 刷新';
  }
}

function handleCategoryChange(category) {
  currentCategory = category;
  
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  
  renderNews();
}

function getFilteredNews() {
  if (currentCategory === 'all') {
    return [...allNews.finance, ...allNews.tech];
  } else if (currentCategory === 'finance') {
    return allNews.finance;
  } else if (currentCategory === 'tech') {
    return allNews.tech;
  }
  return [];
}

function renderNews() {
  const filtered = getFilteredNews();

  if (filtered.length === 0) {
    newsGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  newsGrid.classList.remove('hidden');

  newsGrid.innerHTML = filtered
    .map(article => `
      <div class="news-card">
        <div class="news-card-header">
          <div class="news-emoji">${article.image || '📰'}</div>
          <div>
            <div class="news-category">
              ${article.category === 'finance' ? '💰 財經' : '💻 科技'}
            </div>
          </div>
        </div>

        <div class="news-card-body">
          <h3 class="news-title">${escapeHtml(article.title)}</h3>
          <p class="news-description">${escapeHtml(article.description || '暫無描述')}</p>

          <div class="news-meta">
            <span class="news-source">${escapeHtml(article.source || '新聞源')}</span>
            <span class="news-date">${formatDate(article.date)}</span>
          </div>

          ${
            article.tags && article.tags.length > 0
              ? `
            <div class="news-tags">
              ${article.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          `
              : ''
          }

          ${
            article.url && article.url !== '#'
              ? `
            <div class="news-read-more">
              <a href="${article.url}" target="_blank" class="read-more-btn">
                閱讀全文 →
              </a>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `)
    .join('');
}

function updateLastUpdateTime() {
  if (allNews.lastUpdated) {
    const date = new Date(allNews.lastUpdated);
    const time = date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    lastUpdate.textContent = `最後更新：${time}`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} 分鐘前`;
  } else if (diffHours < 24) {
    return `${diffHours} 小時前`;
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else {
    return date.toLocaleDateString('zh-TW');
  }
}

function showLoading(show) {
  if (show) {
    loadingState.classList.remove('hidden');
    newsGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
  } else {
    loadingState.classList.add('hidden');
  }
}

function showError(message) {
  alert(message);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
