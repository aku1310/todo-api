// add required modules 
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid')
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database');
const secret = process.env.JWT_SECRET || 'default_secret';

const router = express.Router();

// add register route
router.post('/register', async (req, res) => {
  try {

    //  if user is already in the database, then gives the message 'User already exists'
    const user = await findUserByEmail(req.body.email)
    if(user) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      })
    }
    // user enters the credentials
    const { firstName, lastName, email, password, roles } = await req.body;
    // if any field is message then returns the following message
    if (!firstName || !lastName || !email || !password || !roles) {
      return res.status(400).send('Missing required fields');
    }
    // hashes the password for security using bcrypt
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // creates user
    const newUser = {
      user_id: uuidv4(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      roles: roles,
      isActive: true,
    };

    // adds the user to the database
    db.usersDB.insert(newUser, (err, newDoc) => {
      if (newDoc) {
        // creates the unique token
        const token = jwt.sign(
          {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            roles: newUser.roles,
            isActive: newUser.isActive,
          },
          secret,
          // session information
          { expiresIn: '1h' }
        );
        // returns the unique token for the current session
        return res.status(200).json({ token })
      }
    })
  } catch (error) {
    console.log(error);
    // else returns the internal server error
    res.status(500).send('Internal Server Error');
  }
});

// add login route
router.post('/login', async (req, res) => {
  try {
    // user enters the required details
    const { email, password } = await req.body;
    // if email or password is missing then returns the following message
    if (!email || !password) {
      return res.status(400).send('Missing required fields');
    }

    // checks if the user is in the database
    const user = await findUserByEmail(req.body.email)
    
    // if user does not exist then returns the following message
    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    
    // compares the hashed password with the hashed password saved in the database
    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    // if the password is incorrect then returns the following message
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Credentials'
      })
    }

    // if password is correct then creates a unique token
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        isActive: user.isActive,
      },
      secret,
      // session information
      { expiresIn: '1h' }
      );
      // returns the unique token
    return res.status(200).json({ token })
  } catch (error) {
    // if any error occurs then returns the following message
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});


// helper function to find a user by email
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    // uses in-built findOne function of NeDB
    db.usersDB.findOne(
      {
        email,
      },
      (err, user) => {
        if (err) {
          reject(err)
        }
        resolve(user)
      }
    )
  })
}

// exports the router
module.exports = router