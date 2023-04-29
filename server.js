// add required modules 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// creates variables for the required controllers
const authController = require('./routes/authController');
const todoController = require('./routes/todoController');

// create variable for the authentication token
const { authenticateToken } = require('./middleware/middleware');

// using cors and body parser for the api
app.use(cors());
app.use(bodyParser.json());

// create the route to be used by the controllers
app.use('/auth', authController); // only authController is required
app.use('/api/todos', authenticateToken, todoController); // additional token is required for security

app.listen(3000, () => {
  // to see if the app is running on the console
  console.log('Server started on port 3000');
});
