// Use LocalStorage instead of API
const STORAGE_KEY = 'todos_data';
const API_URL = null; // No backend needed

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
function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
    renderTodos();
    updateStats();
  } catch (err) {
    console.error('Error loading todos:', err);
    todos = [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Error saving todos:', err);
  }
}

function handleAddTodo(e) {
  e.preventDefault();
  
  const title = todoInput.value.trim();
  if (!title) return;

  const newTodo = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos();
  todoInput.value = '';
  renderTodos();
  updateStats();
  todoInput.focus();
}

function handleToggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
  updateStats();
}

function handleDeleteTodo(id) {
  if (!confirm('確定要刪除此項目嗎？')) return;

  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  updateStats();
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
