const API_URL = '/api/todos';

let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todosList = document.getElementById('todosList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

// Event Listeners
todoForm.addEventListener('submit', handleAddTodo);
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
});

// Initialize
loadTodos();

// Functions
async function loadTodos() {
  try {
    const response = await fetch(API_URL);
    todos = await response.json();
    renderTodos();
    updateStats();
  } catch (err) {
    console.error('Error loading todos:', err);
  }
}

async function handleAddTodo(e) {
  e.preventDefault();
  
  const title = todoInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const newTodo = await response.json();
    todos.push(newTodo);
    todoInput.value = '';
    renderTodos();
    updateStats();
  } catch (err) {
    console.error('Error adding todo:', err);
    alert('新增失敗，請重試');
  }
}

async function handleToggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });

    const updated = await response.json();
    const index = todos.findIndex(t => t.id === id);
    todos[index] = updated;
    renderTodos();
    updateStats();
  } catch (err) {
    console.error('Error updating todo:', err);
    alert('更新失敗，請重試');
  }
}

async function handleDeleteTodo(id) {
  if (!confirm('確定要刪除此項目嗎？')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    updateStats();
  } catch (err) {
    console.error('Error deleting todo:', err);
    alert('刪除失敗，請重試');
  }
}

function handleFilter(filter) {
  currentFilter = filter;
  
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  
  renderTodos();
}

function getFilteredTodos() {
  switch (currentFilter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
}

function renderTodos() {
  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    todosList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  todosList.innerHTML = filtered
    .map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
          onchange="handleToggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.title)}</span>
        <button class="todo-delete" onclick="handleDeleteTodo(${todo.id})">刪除</button>
      </div>
    `)
    .join('');
}

function updateStats() {
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;
  
  totalCount.textContent = todos.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Focus input on page load
window.addEventListener('load', () => {
  todoInput.focus();
});
