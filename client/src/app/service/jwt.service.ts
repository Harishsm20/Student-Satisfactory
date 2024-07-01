import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './../views/authentication/shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private jwtHelper: JwtHelperService) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  public getRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.role || '';
    }
    return '';
  }
  public getId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || '';
    }
    return '';
  }
  public getbatch(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.batch || '';
    }
    return '';
  }
  public getRollNo(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.rollNo || '';
    }
    return '';
  }

  public getUserDetails(): { 
    role: string, 
    rollNo: string, 
    batch: string, 
    name: string, 
    email: string, 
    department: string 
  } | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return {
        role: decodedToken?.role || '',
        rollNo: decodedToken?.rollNo || '',
        batch: decodedToken?.batch || '',
        name: decodedToken?.name || '',
        email: decodedToken?.email || '',
        department: decodedToken?.department || ''
      };
    }
    return null;
  }
}

