const express = require('express');
const Survey = require('../models/survey');
const User = require('../models/users'); // Needed for faculty creating surveys
const Question = require('../models/question'); // Needed for adding questions

const router = express.Router();

// Function to add questions to survey
const addQuestionsToSurvey = async (surveyId, questionIds) => {
  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      throw new Error('Survey not found!');
    }
    // Assuming questions is an array field in the survey model
    survey.questions.push(...questionIds);
    await survey.save();
    console.log('Questions added to survey successfully!');
  } catch (error) {
    console.error('Error adding questions to survey:', error);
    throw error;
  }
};

// Create a survey (faculty only)
router.post('/createSurvey', async (req, res) => {
  console.log(`REQUEST BODY: ${JSON.stringify(req.body, null, 2)}`);
  const { batch, semester, startDate, endDate, questions, faculty } = req.body;
  try {
    const newSurvey = new Survey({
      batch,
      semester,
      startDate,
      endDate,
      faculty,
      questions,
    });
    // console.log(newSurvey);
    await newSurvey.save();
    // await addQuestionsToSurvey(newSurvey._id, questionIds); // Add questions to survey
    console.log(`Survey create successfully in db`);
    res.status(201).send({ message: 'Survey created successfully!', survey: newSurvey });
  } catch (err) {
    // console.log(`error: ${err.message}`)
    res.status(400).send({ error: err.message });
  }
});

// Get all surveys (filter by faculty or active status)


// Get a specific survey by Batch
router.get('/getSurveyByBatch/:batch', async (req, res) => {
  const batch = req.params.batch;
  try { 
    const survey = await Survey.findOne({ batch: batch })
      .populate('faculty')
      .populate('questions');

    if (!survey) {
      return res.status(404).send({ message: 'Survey not found!' });
    }
    
    console.log('Survey found:', survey);
    res.status(200).send(survey);
  } catch (err) {
    console.error('Error fetching survey:', err);
    res.status(500).send({ error: err.message });
  }
});

// Submit a survey response (student only) - Added functionality
router.post('/submitResponse', async (req, res) => {
  const student = req.user; // Assuming user data is available from JWT
  const { surveyId, answers } = req.body;
  try {
    if (!student || student.role !== 'student') {
      return res.status(401).send({ message: 'Unauthorized! Only students can submit responses.' });
    }
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).send({ message: 'Survey not found!' });
    }
    const existingResponse = await Response.findOne({ student: student._id, survey: surveyId });
    if (existingResponse) {
      return res.status(400).send({ message: 'You have already submitted a response for this survey!' });
    }
    const newResponse = new Response({
      student: student._id,
      survey: surveyId,
      answers, // Object containing student's answer for each question (linked to question IDs)
    });
    await newResponse.save();
    res.status(201).send({ message: 'Survey response submitted successfully!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
