const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid')
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database');
const secret = process.env.JWT_SECRET || 'default_secret';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {

    const user = await findUserByEmail(req.body.email)
    if(user) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      })
    }
    
    const { firstName, lastName, email, password, roles } = await req.body;
    if (!firstName || !lastName || !email || !password || !roles) {
      return res.status(400).send('Missing required fields');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const newUser = {
      user_id: uuidv4(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      roles: roles,
      isActive: true,
    };

    db.usersDB.insert(newUser, (err, newDoc) => {
      if (newDoc) {
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
          { expiresIn: '1h' }
        );
        return res.status(200).json({ token })
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password) {
      return res.status(400).send('Missing required fields');
    }

    const user = await findUserByEmail(req.body.email)
    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    
    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Credentials'
      })
    }
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
      { expiresIn: '1h' }
      );
    return res.status(200).json({ token })
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
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

module.exports = router