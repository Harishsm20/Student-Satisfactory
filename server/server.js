const express = require('express');
// import { QuestionsComponent } from './../client/src/app/views/questions/questions.component';

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const authController = require('./controllers/authController'); // Import auth controller
const surveyController = require('./controllers/surveyController');
const questionController = require('./controllers/questionController');


const PORT = 3001;

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect('mongodb+srv://Harish:IpcoahXz8yD2IibT@cluster0.p3yw9uj.mongodb.net/SSS', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connect();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

// Use controllers for routing
app.use('/auth', authController); // Use authController for /auth routes
app.use('/surveys',surveyController);
app.use('/questions',questionController);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});