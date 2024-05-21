const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  answers: {
    type: Object,
    required: true,
  },
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;