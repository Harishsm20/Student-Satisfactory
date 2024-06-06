const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  students: [
    {
      rollNo: {
        type: String,
        required: true
      }
    }
  ]
});

responseSchema.index({ batch: 1, semester: 1 }, { unique: true });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
