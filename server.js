const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (homepage)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Route: Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: TODO App (proxy to todo app)
app.use('/projects/todo', (req, res, next) => {
  // Serve the todo app's public files
  express.static(path.join(__dirname, 'projects', 'todo-app', 'public'))(req, res, next);
});

// Route: News App API proxy
app.get('/projects/news/api/news', async (req, res) => {
  try {
    console.log('[NEWS PROXY] GET /api/news');
    const response = await axios.get('http://localhost:3002/api/news', { timeout: 5000 });
    res.json(response.data);
  } catch (err) {
    console.error('[NEWS PROXY ERROR]', err.message);
    res.status(500).json({ error: 'Failed to fetch news', details: err.message });
  }
});

app.get('/projects/news/api/news/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log('[NEWS PROXY] GET /api/news/' + category);
    const response = await axios.get(`http://localhost:3002/api/news/${category}`, { timeout: 5000 });
    res.json(response.data);
  } catch (err) {
    console.error('[NEWS PROXY ERROR]', err.message);
    res.status(500).json({ error: 'Failed to fetch news', details: err.message });
  }
});

app.post('/projects/news/api/news/refresh', async (req, res) => {
  try {
    console.log('[NEWS PROXY] POST /api/news/refresh');
    const response = await axios.post('http://localhost:3002/api/news/refresh', {}, { timeout: 10000 });
    res.json(response.data);
  } catch (err) {
    console.error('[NEWS PROXY ERROR]', err.message);
    res.status(500).json({ error: 'Failed to refresh news', details: err.message });
  }
});

// Route: News App static files
app.use('/projects/news', (req, res, next) => {
  // Serve the news app's public files
  express.static(path.join(__dirname, 'projects', 'news-aggregator', 'public'))(req, res, next);
});

// Redirect TODO API requests
app.use('/api/todos', (req, res) => {
  res.status(404).json({ error: 'TODO app is running separately. Access it at /projects/todo' });
});

// Redirect news API requests
app.use('/api/news', (req, res) => {
  res.status(404).json({ error: 'News app is running separately. Access it at /projects/news' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const codespaceUrl = `https://reimagined-space-robot-w44756rjvpp35xxj-${PORT}.app.github.dev`;
  console.log(`✅ Home Server running at http://localhost:${PORT}`);
  console.log(`   Codespace URL: ${codespaceUrl}`);
  console.log(`   Home: ${codespaceUrl}/`);
  console.log(`   TODO App: ${codespaceUrl}/projects/todo`);
  console.log(`   News App: ${codespaceUrl}/projects/news`);
});
