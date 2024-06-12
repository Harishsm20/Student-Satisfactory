const express = require('express');
const Question = require('../models/question');
const Survey = require('../models/survey'); // Needed for adding questions to survey

const router = express.Router();

// Get questions
router.get('/getquestions', async (req, res) => {
  try {
    const questions = await Question.find(); 
    res.json(questions); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' }); 
  }
});



module.exports = router;
