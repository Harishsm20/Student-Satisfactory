const express = require('express');
const Question = require('../models/question');
const Survey = require('../models/survey'); // Needed for adding questions to survey

const router = express.Router();
// Create a question (might not be used in your case)
exports.createQuestion = async (req, res) => {
  const { text } = req.body;
  try {
    const newQuestion = new Question({ text });
    await newQuestion.save();
    res.status(201).send({ message: 'Question created successfully!', question: newQuestion });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Get questions
router.get('/getquestions', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions from the database
    res.json(questions); // Send the fetched questions as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' }); // Handle errors
  }
});


// Add questions to a survey (assuming questions are selected during survey creation)
exports.addQuestionsToSurvey = async (req, res, surveyId) => {
  const { questionIds } = req.body; // Array of question IDs to be added
  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).send({ message: 'Survey not found!' });
    }
    survey.questions.push(...questionIds); // Add question IDs to survey's questions array
    await survey.save();
    res.status(200).send({ message: 'Questions added to survey successfully!' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = router;
