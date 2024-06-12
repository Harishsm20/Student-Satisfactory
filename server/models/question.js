const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
