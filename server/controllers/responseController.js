const express = require('express');
const Survey = require('../models/survey');
const User = require('../models/users'); // Needed for faculty creating surveys
const Question = require('../models/question'); // Needed for adding questions
const ResponseQuestion = require('../models/response');

const router = express.Router();
const app = express();
app.use(express.json()); // Ensure JSON parsing middleware




// Submit a survey response (student only)
app.post('/submit-survey', async (req, res) => {
  console.log('reached /submit-survey');
  try {
    // Validate required properties
    const questions = req.body.questions;
    const batch = req.body.batch;
    const semester = req.body.semester;

    if (!questions || !batch || !semester) {
      console.log("\n\n\nsomething is missing!!!!")
      return res.status(400).json({ message: 'Missing required survey data' });
    }

    // Check for existing response (consider adding unique identifier for user)
    const existingResponse = await ResponseQuestion.findOne({
      batch,
      semester
    });

    if (existingResponse) {
      console.log("\n\nAlready the data is existing");

      // Update options in existing response for submitted questions
      for (const submittedQuestion of questions) {
        const existingQuestionIndex = existingResponse.questions.findIndex(q => q.questionNo === submittedQuestion.questionNo);

        if (existingQuestionIndex !== -1) {
          const optionKey = `option${submittedQuestion.selectedOption}`;

          // Increment the chosen option and set others to 0
          existingResponse.questions[existingQuestionIndex][optionKey]++;
          for (const key in existingResponse.questions[existingQuestionIndex]) {
            if (key !== optionKey) {
              existingResponse.questions[existingQuestionIndex][key] = 0;
            }
          }
        }
      }

      // Save the updated response
      await existingResponse.save();

      res.status(200).json({ message: 'Survey response updated successfully' });
    } else {
      console.log("\n\nWe have to create a new response");

      // Create a new survey response for the user
      const newResponse = new ResponseQuestion({
        questions,
        batch,
        semester,
        // Add unique identifier for the user (e.g., userId)
      });

      await newResponse.save();

      res.status(201).json({ message: 'Survey response created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting survey' });
  }
});







// Get all responses for a survey (faculty only) - Implement filtering if needed
exports.getAllResponses = async (req, res, surveyId) => {
  try {
    const faculty = req.user; // Assuming user data is available from JWT
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(401).send({ message: 'Unauthorized! Only faculty can view responses.' });
    }
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).send({ message: 'Survey not found!' });
    }
    const responses = await Response.find({ survey: surveyId }).populate('student'); // Populate student data
    res.status(200).send(responses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = app;
