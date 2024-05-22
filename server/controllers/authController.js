const express = require('express');
const User = require('../models/users.js'); // Import the User model from users.js

const router = express.Router();

router.post('/login', async (req, res) => {
  let role = '';
  console.log("Login body:", req.body);
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          role = user.role;
          res.json("Success");
          console.log(`Login Success : ${role}`);
        } else {
          res.json("Password is incorrect");
          console.log("Login Failed");
        }
      } else {
        res.json("Record not found");
        console.log("No record");
      }
    });
});

router.post('/register', async (req, res) => {
  console.log("Received request body:", req.body);

  // Destructure fields from request body
  const { username, email, password, role, department, RollNo, batch } = req.body;
  console.log(`USERNAME : ${username}`);
  console.log(`EMAIL : ${email}`);
  console.log(`Password : ${password}`);
  console.log(`role : ${role}`);
  console.log(`department : ${department}`);
  console.log(`Roll No : ${RollNo}`);
  console.log(`Batch : ${batch}`);

  // Validate required fields
  if (!email || !password || !role || !RollNo) {
    return res.status(400).json({ error: 'Username, email, password, roles, department and RollNo are required fields.' });
  }

  try {
    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
      role,
      department,
      RollNo,
      batch, // Assuming batch is optional
    });

    // Log the new user data before saving
    console.log("Saving new user:", newUser);

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send the saved user object as response
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
