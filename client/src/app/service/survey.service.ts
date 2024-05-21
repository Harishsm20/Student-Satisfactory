import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Survey {
  _id: string;
  batch: string;
  // title: string;
  // description: string;
  semester: string;
  // questionIds: string;
  startDate: Date;
  endDate: Date;
  faculty: any;
  // Update questions property to match backend schema
  questions: Question[]; // Array of Question objects
}

// Define the Question interface for clarity (replace with your actual structure)
interface Question {
  _id?: string; // Optional if questions already have IDs
  text: string;
  options: { text: string }[]; // Array of objects with text property
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  baseUrl = 'http://localhost:3001'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getSurveyById(surveyId: string): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/surveys/${surveyId}`); // Specify expected return type
  }

  // Add a new method to get all active surveys with their questions
  getFilteredSurveys(filter?: { semester?: string }): Observable<Survey[]> {
    let url = `${this.baseUrl}/surveys/active`;
    if (filter && filter.semester) {
      url += `?semester=${filter.semester}`;
    }
    return this.http.get<Survey[]>(url); // Specify the expected return type as an array of Survey objects
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/getquestions`); // Update endpoint for questions
  }

  createSurvey(surveyData: Survey[]): Observable<Survey> {
    console.log('Survey Data Type:', typeof surveyData); // Check the type
    console.table(surveyData);
    
    return this.http.post<Survey>(`${this.baseUrl}/surveys/create`, surveyData);
  }
  
}
