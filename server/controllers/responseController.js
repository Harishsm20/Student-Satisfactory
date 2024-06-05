const express = require('express');
const ResponseQuestion = require('../models/responseQuestion');

const router = express.Router();
const app = express();
app.use(express.json()); // Ensure JSON parsing middleware

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

module.exports = app;
