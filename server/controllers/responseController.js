const Response = require('../models/response');
const Survey = require('../models/survey'); // Needed for checking survey existence

// Submit a survey response (student only)
exports.submitResponse = async (req, res) => {
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
};

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

module.exports = exports;
