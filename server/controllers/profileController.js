const express = require('express');
const User = require('../models/users.js');
const router = express.Router();

// Update user name
router.put('/updateName/:rollNo', async (req, res) => {
  const rollNo = req.params.rollNo.trim();
  const name = req.body.name.trim();
  console.log(`rollNo: ${rollNo}, name: ${name}`);

  try {
    const user = await User.findOne({ RollNo: rollNo });
    console.log("Found user: ", user);

    if (user) {
      user.username = name;
      await user.save();
      console.log("Updated successfully");
      res.status(200).send({ message: 'User name updated successfully', user });
    } else {
      console.log("User not found");
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({ message: 'Error updating user name', error });
  }
});

module.exports = router;
