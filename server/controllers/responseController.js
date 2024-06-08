const express = require('express');
const ResponseQuestion = require('../models/responseQuestion');
const Response =  require('../models/response');
const User = require('../models/users');

const router = express.Router();
const app = express();
app.use(express.json()); // Ensure JSON parsing middleware


app.post('/submitStudentResponse', async (req, res) => {
  const { batch, semester, studentRollNo } = req.body;

  try {
    console.log(`Received request to submit survey for batch: ${batch}, semester: ${semester}, studentRollNo: ${studentRollNo}`);

    // Check if the student has already submitted the survey for the given batch and semester
    const existingStudentResponse = await Response.findOne({ batch, semester, 'students.rollNo': studentRollNo });

    if (existingStudentResponse) {
      console.log(`Student ${studentRollNo} has already submitted the survey for batch ${batch}, semester ${semester}`);
      return res.status(400).json({ message: 'Student has already submitted the survey' });
    }

    // Add the student's roll number to the students collection
    const response = await Response.findOneAndUpdate(
      { batch, semester },
      { $addToSet: { students: { rollNo: studentRollNo } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Student ${studentRollNo} successfully added to the survey for batch ${batch}, semester ${semester}`);
    res.status(200).json({ message: 'Survey submitted successfully', response });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ error: error.message });
  }
});



// Submit a survey response (student only)
app.post('/submit-survey', async (req, res) => {
  console.log('Reached /submit-survey');
  
  // Log the entire questions object
  console.log('Received questions:', JSON.stringify(req.body.questions, null, 2));
  
  try {
    // Validate required properties
    const { questions, batch, semester } = req.body;

    if (!questions || !batch || !semester) {
      console.log("Something is missing!!!!");
      return res.status(400).json({ message: 'Missing required survey data' });
    }

    // Check for existing response for the given batch and semester
    let existingResponse = await ResponseQuestion.findOne({ batch, semester });

    if (existingResponse) {
      console.log("Already existing data found");

      // Update options in existing response for submitted questions
      for (const submittedQuestion of questions) {
        const existingQuestion = existingResponse.questions.find(q => q.questionNo === submittedQuestion.questionNo);

        if (existingQuestion) {
          for (let i = 1; i <= 5; i++) {
            const optionKey = `option${i}`;
            if (submittedQuestion[optionKey] === 1) {
              existingQuestion[optionKey]++;
            }
          }
        } else {
          // If the question doesn't exist in the current response, add it
          const newQuestion = {
            questionNo: submittedQuestion.questionNo,
            text: submittedQuestion.text,
            option1: submittedQuestion.option1,
            option2: submittedQuestion.option2,
            option3: submittedQuestion.option3,
            option4: submittedQuestion.option4,
            option5: submittedQuestion.option5
          };
          existingResponse.questions.push(newQuestion);
        }
      }

      // Save the updated response
      await existingResponse.save();

      res.status(200).json({ message: 'Survey response updated successfully' });
    } else {
      console.log("Creating a new response");

      // Create a new survey response
      const newResponse = new ResponseQuestion({
        questions: questions.map(q => ({
          questionNo: q.questionNo,
          text: q.text,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          option5: q.option5
        })),
        batch,
        semester
      });

      await newResponse.save();

      res.status(201).json({ message: 'Survey response created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting survey' });
  }
});


app.get('/pending-students', async (req, res) => {
  const { batch, semester } = req.query;

  try {
    // Fetch all students of the selected batch
    const allStudents = await User.find({ batch }).select('RollNo department email username'); // Adjust the fields as needed

    // Fetch students who have submitted the survey
    const response = await Response.findOne({ batch, semester }).select('students.rollNo');
    const submittedRollNos = response ? response.students.map(student => student.rollNo) : [];

    // Find students who haven't submitted the survey
    const pendingStudents = allStudents.filter(student => !submittedRollNos.includes(student.RollNo));

    res.status(200).json({ pendingStudents });
  } catch (error) {
    console.error('Error fetching pending students:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/responseData', async (req, res) => {
  console.log("Reached Response Data");
  const { batch, semester, questionNo } = req.query;

  if (!batch || !semester || !questionNo) {
    console.log("missing")
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  try {
    const response = await ResponseQuestion.findOne({
      batch,
      semester,
      'questions.questionNo': questionNo
    }, {
      'questions.$': 1 // Only select the specific question
    });
    console.log(response);

    if (!response) {
      console.log("error")
      return res.status(404).json({ message: 'No response data found for the given criteria' });
    }
    console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching response data:', error);
    res.status(500).json({ message: 'Error fetching response data', error: error.message });
  }
});



module.exports = app;
