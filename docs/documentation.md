## **About The Project**

This is a simple Node.js-based Web API using the latest LTS version of Node.js and an in-memory database. The API has two controllers, **TodoController** and **AuthController**. TodoController has **CRUD APIs** for managing todo items, including */get/{id}*, */getall*, */put/{id}*, */create/{id}*, and */delete/{id}*. AuthController has APIs related to registration and login.

TodoController is protected, and only authenticated users with two different roles will have access to it. 

* User role users can only get the list of todo items, and other APIs should return a 401 unauthorized error. 
* Admin role users can access all APIs, including viewing other user's todo items.

In AuthController, upon successful login, the response should contain a **JWT token** that encodes the user's first name, last name, email, isActive, and roles.

### **Build With**

#### **Node.js**
Node.js is a popular open-source JavaScript runtime environment that allows developers to build scalable and fast server-side applications. It provides a non-blocking I/O model that enables developers to handle multiple client requests simultaneously. Node.js is highly extensible and has a vast library of modules and packages available, making it a go-to choice for developing web applications.

#### **NeDB**
NeDB is a lightweight and easy-to-use in-memory database that is written entirely in JavaScript. It is designed to provide a fast and efficient way of storing and retrieving data for Node.js applications. NeDB offers a simple API for managing data and supports indexing and querying capabilities. Its in-memory nature makes it ideal for storing small to medium-sized datasets, making it a great option for prototyping and testing.

#### **Postman**
Postman is a popular API development tool that allows developers to design, test, and document APIs. It provides a simple and intuitive interface for making HTTP requests and supports a wide range of protocols and formats, including REST, SOAP, and GraphQL. Postman enables developers to automate the testing and documentation process, making it easier to collaborate and share API designs with other team members. It also offers a range of features, including response validation, API monitoring, and team collaboration tools, that help streamline the API development process.

### **Server File**

* The code sets up an *Express server*.
* It includes the necessary dependencies: *Express*, *Body-parser*, *CORS* and *JSONwebtoken*.
* It initializes the app by calling the express function and stores the result in the app variable.
* It imports the authentication and todo controllers from their respective routes files.
* It imports the middleware function authenticateToken from the middleware file.
* The code sets up middleware to handle CORS and JSON requests.
* It sets up routes for the authentication and todo controllers and mounts them to specific paths using *app.use()*.
* The todo routes are protected with authenticateToken middleware, ensuring that only authorized users have access to these routes.
* Finally, the server listens on port 3000 and logs a message to the console when it starts.

### **Controller Files**

#### **Auth Controller**
* Required modules are imported at the beginning: *bcrypt*, *uuidv4*, *express*, *jwt*, and the database module.
* The router object is created using the *express.Router()* method.
* Two routes are defined: */register* and */login*.
* In the /register route, the function first checks if the user with the same email exists. If the user exists, it returns a *409 status* code with the appropriate message. Then, it checks if all the required fields are present in the request body. If not, it returns a *400 status* code with the appropriate message. If everything is fine, the user's password is hashed, a new user object is created, and it's inserted into the database. Then, a JWT token is generated using the user's data, and it's returned in the response body with a *200 status* code.
* In the */login* route, the function first checks if all the required fields are present in the request body. If not, it returns a *400 status* code with the appropriate message. Then, it searches for the user with the given email in the database. If the user is not found, it returns a 404 status code with the appropriate message. If the user is found, the function checks if the provided password matches the hashed password stored in the database. If the password is invalid, it returns a *401 status* code with the appropriate message. If the password is valid, a JWT token is generated using the user's data, and it's returned in the response body with a 200 status code.
* A helper function *findUserByEmail* is defined to search for a user with a given email in the database.
* At the end, the router object is exported.

#### **Todo Controller**
* This code requires the following packages: *express*, *jsonwebtoken*, *uuid*.
* The code exports a router object that handles API endpoints related to todo items.
* The router has five endpoints: *get all todos*, *get a single todo*, *create a new todo*, *update a todo*, and *delete a todo*.
* The authenticateToken middleware is used in all endpoints to verify the authenticity of the user.
* The *get all todos* endpoint returns all the todos if the user is an admin, or else returns only the user's todos.
* The *get a single todo* endpoint returns a single todo by id if the user has access to that todo.
* The *create a new todo* endpoint creates a new todo with a unique id and returns the created todo.
* The *update a todo* endpoint updates an existing todo by id if the user has access to that todo.
* The *delete a todo* endpoint deletes an existing todo by id if the user has access to that todo.

### **Middleware File**

This code defines a middleware function called "authenticateToken" that:

* receives a request *(req)*, a response *(res)* and a *next* callback function as parameters.
* extracts a *JWT token* from the request header, if it exists.
* verifies the token using a secret key and decodes it to obtain the user information.
* adds the user information to the request object for later use.
* calls the next middleware function in the chain if the token is valid.
* returns a 401 or 403 HTTP error response if the token is missing or invalid.

The module exports the *authenticateToken* function for use in other parts of the application.

### **Model File**

This code defines two objects, Todo and User, each with several methods that interact with a database.

**Todo**:
* *create(data, callback)* - inserts a new document into the database with the given data
* *update(id, data, callback)* - updates the document with the given id with the new data
* *delete(id, callback)* - deletes the document with the given id
* *getById(id, callback)* - retrieves the document with the given id
* *getAll(callback)* - retrieves all documents in the database

**User**:
* *create(data, callback)* - inserts a new user document into the database with the given data
* *getByEmail(email, callback)* - retrieves the user document with the given email

### **Database File**

This code creates two NeDB databases, *usersDB* and *todosDB*, and exports them as modules. The code can be summarized as follows:

* Require the nedb module.
* Create two NeDB databases: *usersDB* and *todosDB*.
* Load the databases.
* Export the two databases as modules.
