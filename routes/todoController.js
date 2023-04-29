const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { todos } = require('./db');
const { authenticateToken } = require('../middleware/middleware');

// Get all todos
router.get('/api/todos', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json(todos);
  } else {
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  }
});

// Get a single todo
router.get('/api/todos/:id', authenticateToken, (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }
  if (req.user.role !== 'admin' && todo.userId !== req.user.id) {
    return res.status(401).send('Unauthorized');
  }
  res.json(todo);
});

// Create a new todo
router.post('/api/todos', authenticateToken, (req, res) => {
  const { title, completed } = req.body;
  const newTodo = {
    id: uuidv4(),
    title,
    completed,
    userId: req.user.id,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

// Update a todo
router.put('/api/todos/:id', authenticateToken, (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }
  if (req.user.role !== 'admin' && todo.userId !== req.user.id) {
    return res.status(401).send('Unauthorized');
  }
  todo.title = req.body.title;
  todo.completed = req.body.completed;
  res.json(todo);
});

// Delete a todo
router.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const todoIndex = todos.findIndex(todo => todo.id === req.params.id);
  if (todoIndex === -1) {
    return res.status(404).send('Todo not found');
  }
  if (req.user.role !== 'admin' && todos[todoIndex].userId !== req.user.id) {
    return res.status(401).send('Unauthorized');
  }
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

module.exports = router;
