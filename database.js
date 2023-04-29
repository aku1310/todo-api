// add required modules 
const Datastore = require('nedb');

// create variables for the required databases to be created
const usersDB = new Datastore('users.db');
const todosDB = new Datastore('todos.db');

usersDB.loadDatabase();
todosDB.loadDatabase();

// export the in-memory databases
module.exports = {
  usersDB,
  todosDB,
};
