
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Assuming it's a global service
})
export class RegisterService {

  private baseUrl = 'http://localhost:3001/auth'; // Assuming your server is running on port 3001

  constructor(private http: HttpClient) { }

  registerUser (data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }
}
