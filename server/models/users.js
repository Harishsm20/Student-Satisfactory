const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique:true,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
   
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty'],
    required: true
  },
  RollNo: {
    type: String,
    required: true,
    unique: true
   },
  department : {
    type: String,
    required: true,
   },
  batch: {
    type: String,
    required: true // Assuming batch is optional
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;