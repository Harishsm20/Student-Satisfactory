import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = 'http://localhost:3001/profile'; 
  
  constructor(private http: HttpClient) { }

  updateUserName(rollNo: string, name: string): Observable<any> {
    console.log("Reached function");
    const url = `${this.baseUrl}/updateName/${rollNo}`;
    return this.http.put(url, { name });
  }
}
