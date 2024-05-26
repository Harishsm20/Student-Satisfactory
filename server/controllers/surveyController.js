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
  const faculty = req.user; // Assuming user data is available from JWT
  const { title, description, semester, startDate, endDate, questionIds } = req.body;
  try {
    // if (!faculty || faculty.role !== 'faculty') {
    //   console.log("Only faculties can create this");
    //   return res.status(401).send({ message: 'Unauthorized! Only faculty can create surveys.' });
    // }
    const newSurvey = new Survey({
      title,
      description,
      semester,
      startDate,
      endDate,
      faculty: faculty._id,
      questions: [], // Initially empty, questions added later
    });
    await newSurvey.save();
    await addQuestionsToSurvey(newSurvey._id, questionIds); // Add questions to survey
    console.log(`Survey create successfully in db`);
    res.status(201).send({ message: 'Survey created successfully!', survey: newSurvey });
  } catch (err) {
    console.log(err.message)
    res.status(400).send({ error: err.message });
  }
});

// Get all surveys (filter by faculty or active status)
router.get('/getAllSurveys', async (req, res) => {
  const { facultyId, isActive } = req.query; // Optional query parameters for filtering
  let filter = {};
  if (facultyId) {
    filter.faculty = facultyId;
  }
  if (isActive) {
    const today = new Date();
    filter.startDate = { $lte: today };
    filter.endDate = { $gte: today };
  }
  try {
    const surveys = await Survey.find(filter).populate('faculty'); // Populate faculty data
    res.status(200).send(surveys);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get a specific survey by ID
router.get('/getSurveyById/:surveyId', async (req, res) => {
  const surveyId = req.params.surveyId;
  try {
    const survey = await Survey.findById(surveyId).populate('faculty questions'); // Populate faculty and questions data
    if (!survey) {
      return res.status(404).send({ message: 'Survey not found!' });
    }
    res.status(200).send(survey);
  } catch (err) {
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