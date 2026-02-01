const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_PATH = process.env.BASE_PATH || '/';
const DATA_FILE = path.join(__dirname, 'todos.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read todos
function getTodos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading todos:', err);
  }
  return [];
}

// Helper to save todos
function saveTodos(todos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving todos:', err);
  }
}

// API Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  const todos = getTodos();
  res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todos = getTodos();
  const newTodo = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

// Update a todo (toggle completed status)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;

  const todos = getTodos();
  const todo = todos.find(t => t.id == id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (completed !== undefined) todo.completed = completed;
  if (title !== undefined) todo.title = title.trim();

  saveTodos(todos);
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  let todos = getTodos();
  const initialLength = todos.length;
  todos = todos.filter(t => t.id != id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  saveTodos(todos);
  res.json({ message: 'Todo deleted' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TODO App running at http://localhost:${PORT}`);
  console.log(`   Codespace URL: https://reimagined-space-robot-w44756rjvpp35xxj-${PORT}.app.github.dev`);
});
