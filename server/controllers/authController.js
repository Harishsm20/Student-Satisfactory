const express = require('express');
const User = require('../models/users.js');
const crypto = require('crypto');
const secretKey = require('crypto').randomBytes(32).toString('hex'); 
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  let role = '';
  console.log("Login body:", req.body);
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      console.log(user);
      if (user) {
        if (user.password === password) {
          role = user.role;
          console.log(`Login Success : ${role}`);
          const token = jwt.sign({ userId: user._id, role: user.role, rollNo: user.RollNo, batch: user.batch, name: user.username, email: user.email, department: user.department }, secretKey, { expiresIn: '1h' }); 
          console.log(token);
          return res.json({
            success: true,
            role: role, 
            message: 'Authentication successful',
            token, 
          }); 
        } else {
          res.json({
            success: false,
            message: 'Password is incorrect'
          });
          console.log("Login Failed: Password is incorrect");
        }
      } else {
        res.json({
          success: false,
          message: 'Record not found'
        });
        console.log("Login Failed: No record");
      }
    });
});

router.post('/register', async (req, res) => {
  console.log("Received request body:", req.body);


  const { username, email, password, role, department, RollNo, batch } = req.body;
  console.log(`USERNAME : ${username}`);
  console.log(`EMAIL : ${email}`);
  console.log(`Password : ${password}`);
  console.log(`role : ${role}`);
  console.log(`department : ${department}`);
  console.log(`Roll No : ${RollNo}`);
  console.log(`Batch : ${batch}`);

  if (!email || !password || !role || !RollNo) {
    return res.status(400).json({ error: 'Username, email, password, roles, department and RollNo are required fields.' });
  }

  try {
    const newUser = new User({
      username,
      email,
      password,
      role,
      department,
      RollNo,
      batch, 
    });

    console.log("Saving new user:", newUser);

    const savedUser = await newUser.save();

    res.json(savedUser);

  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      res.status(400).json({ error: validationErrors });
    } else {
      console.error("Error saving user:", err);
      res.status(500).json({ error: 'Error registering user.' });
    }
  }
});

module.exports = router;
