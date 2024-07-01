


  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  
  
  @Injectable({
    providedIn: 'root'
  })
  export class ProfileService {
    baseUrl = 'http://localhost:3001'; // Replace with your API endpoint
  
    constructor(private http: HttpClient) { }
    updateUserName(rollNo: string, name: string): Observable<any> {
        const url = `${this.baseUrl}/profile/updateName/${rollNo}`;
        return this.http.put(url, { name });
    }
  

    
  }
  