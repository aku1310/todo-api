// add required modules 
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { todos } = require('./db');
const { authenticateToken } = require('../middleware/middleware');

// Get all todos
router.get('/api/todos', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    // all todos are returned
    res.json(todos);
  } else {
    // if the role is user then only their own todos are shown
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  }
});

// Get a single todo
router.get('/api/todos/:id', authenticateToken, (req, res) => {
  // uses in-build find function of NeDB
  const todo = todos.find(todo => todo.id === req.params.id);
  if (!todo) {
    // if todo is not found by the user id
    return res.status(404).send('Todo not found');
  }
  // if the user is different or it is not an admin then they cannot see the todos
  if (req.user.role !== 'admin' && todo.userId !== req.user.id) {
    return res.status(401).send('Unauthorized');
  }
  // returns the todo
  res.json(todo);
});

// Create a new todo
router.post('/api/todos', authenticateToken, (req, res) => {
  // user enters the title and completion status of the todo
  const { title, completed } = req.body;
  // creates the new todo object
  const newTodo = {
    id: uuidv4(),
    title,
    completed,
    userId: req.user.id,
  };
  // adds the todo to the database
  todos.push(newTodo);
  res.json(newTodo);
});

// Update a todo
router.put('/api/todos/:id', authenticateToken, (req, res) => {
  // uses in-build find function of NeDB
  const todo = todos.find(todo => todo.id === req.params.id);
  if (!todo) {
    // if todo is not found by the user id
    return res.status(404).send('Todo not found');
  }
  if (req.user.role !== 'admin' && todo.userId !== req.user.id) {
    // if the user is different or it is not an admin then they cannot see the todos
    return res.status(401).send('Unauthorized');
  }
  // user re-enters the title and completion status
  todo.title = req.body.title;
  todo.completed = req.body.completed;
  // returns the todo
  res.json(todo);
});

// Delete a todo
router.delete('/api/todos/:id', authenticateToken, (req, res) => {
  // uses in-build find function of NeDB
  const todoIndex = todos.findIndex(todo => todo.id === req.params.id);
  if (todoIndex === -1) {
    // if todo is not found by the user id
    return res.status(404).send('Todo not found');
  }
  if (req.user.role !== 'admin' && todos[todoIndex].userId !== req.user.id) {
    // if the user is different or it is not an admin then they cannot see the todos
    return res.status(401).send('Unauthorized');
  }
  // slices the database by 1 todo
  todos.splice(todoIndex, 1);
  // returns the 200 status
  res.status(204).send();
});

// exports the router
module.exports = router;
