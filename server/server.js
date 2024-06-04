const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const authController = require('./controllers/authController'); // Import auth controller
const surveyController = require('./controllers/surveyController');
const questionController = require('./controllers/questionController');
const responseController = require('./controllers/responseController');
const dotenv = require('dotenv');



const PORT = 3001;
dotenv.config();

// Connect to MongoDB
const connect = async () => {
  try {
      await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p3yw9uj.mongodb.net/${process.env.DB_NAME}`, {

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
app.use('/response',responseController);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});