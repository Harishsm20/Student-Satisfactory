const express = require('express');
const Survey = require('../models/survey');
const User = require('../models/users'); // Needed for faculty creating surveys
const Question = require('../models/question'); // Needed for adding questions

const router = express.Router();

// Create a survey (faculty only)
router.post('/createSurvey', async (req, res) => {
  console.log(`REQUEST BODY: ${JSON.stringify(req.body, null, 2)}`);
  const { batch, semester, startDate, endDate, questions, faculty } = req.body;
  

  try {

    const existingSurvey = await Survey.findOne({ batch, semester });
    if (existingSurvey) {
        return res.status(400).send({ message: 'Survey for this batch and semester already exists.' });
    }

    const newSurvey = new Survey({
      batch,
      semester,
      startDate,
      endDate,
      faculty,
      questions,
    });
    await newSurvey.save();
    console.log(`Survey create successfully in db`);
    res.status(201).send({ message: 'Survey created successfully!', survey: newSurvey });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


// Get a specific survey by Batch
router.get('/getSurveyByBatch/:batch/:semester', async (req, res) => {
  const batch = req.params.batch;
  const semester = req.params.semester;
  try { 
    const survey = await Survey.findOne({ batch: batch, semester: semester })
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
  const student = req.user; 
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
      answers, 
    });
    await newResponse.save();
    res.status(201).send({ message: 'Survey response submitted successfully!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
