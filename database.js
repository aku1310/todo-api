const Datastore = require('nedb');

const usersDB = new Datastore('users.db');
const todosDB = new Datastore('todos.db');

usersDB.loadDatabase();
todosDB.loadDatabase();

module.exports = {
  usersDB,
  todosDB,
};
