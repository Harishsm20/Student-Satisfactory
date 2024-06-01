const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
 
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  questions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    required: true
  }
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;