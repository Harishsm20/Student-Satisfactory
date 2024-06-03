import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Survey {
  _id: string;
  batch: string;
  // title: string;
  // description: string;
  // semester: string;
  // questionIds: string;
  startDate: Date;
  endDate: Date;
  faculty: any;
  questions: Question[]; 
}

// Define the Question interface for clarity (replace with your actual structure)
interface Question {
  _id?: string; 
  text: string;
  options: { text: string }[]; 
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  baseUrl = 'http://localhost:3001'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getSurveyByBatch(batch: string): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/surveys/getSurveyByBatch/${batch}`); 
  }

  getFilteredSurveys(filter?: { semester?: string }): Observable<Survey[]> {
    let url = `${this.baseUrl}/surveys/active`;
    if (filter && filter.semester) {
      url += `?semester=${filter.semester}`;
    }
    return this.http.get<Survey[]>(url); 
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/getquestions`); 
  }
 
  createSurvey(surveyData: Survey[]): Observable<Survey> {
    console.log('Survey Data Type:', typeof surveyData); 
    console.table(surveyData);
    
    return this.http.post<Survey>(`${this.baseUrl}/surveys/createSurvey`, surveyData);
  }
  submitSurvey(surveySubmission: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/responses/createResponse`, surveySubmission);
  }
  
}
