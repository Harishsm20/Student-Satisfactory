const express = require('express');
const User = require('../models/users.js')
const router = express.Router();

// Get questions
router.put('updateName/:rollNo', async (req, res) => {
    const rollNo = req.params.rollNo;
    const name = req.body.name;
    console.log(`${rollNo}, ${name}`);
    try {
      const user = await User.findOneAndUpdate({ rollNo: rollNo }, { name: name }, { new: true });
      if (user) {
        console.log("updated sucessfully");
        res.status(200).send({ message: 'User name updated successfully', user });
      } else {
        console.log("User not found");
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
        console.log("Error");
        res.status(500).send({ message: 'Error updating user name', error });

    }
  });



module.exports = router;
