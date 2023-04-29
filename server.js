const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const authController = require('./routes/authController');
const todoController = require('./routes/todoController');

const { authenticateToken } = require('./middleware/middleware');

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authController);
app.use('/api/todos', authenticateToken, todoController);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
