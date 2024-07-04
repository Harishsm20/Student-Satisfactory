# Student Survey Dashboard (dup)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Survey Management](#survey-management)
  - [Student Responses](#student-responses)
- [Components](#components)
  - [DashboardComponent](#dashboardcomponent)
  - [QuestionsComponent](#questionscomponent)
- [Services](#services)
  - [SurveyService](#surveyservice)
  - [JwtService](#jwtservice)
- [Authentication](#authentication)
  - [JWT Service](#jwt-service)
- [Contributing](#contributing)

## Introduction

The Student Survey Dashboard is a comprehensive web application designed to streamline the process of managing and analyzing student survey responses. It provides faculty members with the tools to create, filter, and visualize surveys, and track student submissions. The application is built using modern web technologies to ensure a robust and responsive user experience.

## Features

- **User Authentication:** Secure login system with role-based access control.
- **Survey Management:** Faculty can create, view, and filter surveys by batch and semester.
- **Data Visualization:** Visual representation of survey results using bar charts.
- **Pending Submissions:** Identification of students who have not submitted their surveys, with the option to send reminder emails.
- **Responsive Design:** Optimized for various devices and screen sizes.

## Technologies Used

- **Frontend:** Angular, TypeScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Charting Library:** Chart.js
- **Authentication:** JSON Web Tokens (JWT)

## Project Structure

```plaintext
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── app.component.ts
│   │   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package.json
├── README.md
└── angular.json
```

## Setup and Installation

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Angular CLI installed globally

## Backend Setup
1. **Navigate to the backend directory:**
   ```sh
   cd server
   ```
   
2. **Install dependencies:**
```sh
npm install
```

3. **Create a .env file and configure your environment variables:**
env
DB_USER, DB_NAME, DB_PASSWORD

4. **Start the backend server:**
```sh
node server
```

## Frontend Setup
1. **Navigate to the frontend directory:**
```sh
cd client
```

2. **Install dependencies:**
```sh
npm install
```

3. **Start the frontend server:**
```sh
npm start
```

## Usage
- Open your browser and navigate to `http://localhost:4200`.
- Log in with your credentials. Faculty members have access to survey management and data visualization features, while students can submit survey responses.

## API Endpoints

### User Authentication
- **POST /api/auth/login:** Authenticate user and provide a JWT token.
- **POST /api/auth/register:** Register a new user.

### Survey Management
- **GET /api/surveys:** Fetch all surveys.
- **GET /api/surveys/getSurveyByBatchAndSemester/:batch/:semester:** Fetch a survey based on batch and semester.
- **POST /api/surveys:** Create a new survey.
- **PUT /api/surveys/:id:** Update an existing survey.
- **DELETE /api/surveys/:id:** Delete a survey.

### Student Responses
- **POST /api/responses:** Submit student responses.
- **GET /api/responses/pending/:batch/:semester:** Get pending student submissions.

## Components

### DashboardComponent
- **Location:** `src/app/components/dashboard/dashboard.component.ts`
- **Description:** Displays the survey dashboard for faculty members, including filters, survey visualization, and pending student submissions.

### QuestionsComponent
- **Location:** `src/app/components/questions/questions.component.ts`
- **Description:** Allows students to submit survey responses and handles survey filtering based on semester.

## Services

### SurveyService
- **Location:** `src/app/services/survey.service.ts`
- **Description:** Handles HTTP requests related to surveys, including fetching surveys, submitting responses, and getting pending submissions.

### JwtService
- **Location:** `src/app/services/jwt.service.ts`
- **Description:** Manages JWT tokens for user authentication and role-based access control.

## Authentication
The application uses JSON Web Tokens (JWT) for authentication. Upon successful login, a JWT token is issued and stored in the local storage. This token is then used to authenticate and authorize subsequent API requests.

### JWT Service
**Methods:**
- **login(credentials: any):** Authenticates the user and stores the token.
- **logout():** Clears the token from local storage.
- **getRole():** Retrieves the user role from the token.
- **getBatch():** Retrieves the user batch from the token.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's coding standards and includes appropriate tests.

