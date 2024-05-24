import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

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
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.role;
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return ''; 
      }
    }
    return '';
  }
}

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class JwtService {
//   public isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');
//     return token != null; // Check for token existence
//   }

//   public getRoleFromToken(token: string): string | null {
//     if (!token) {
//       return null;
//     }
//     try {
//       const decodedToken = JSON.parse(atob(token.split('.')[1]));
//       return decodedToken.role; // Assuming "role" is the property name
//     } catch (error) {
//       console.error('Error decoding JWT token:', error);
//       return null;
//     }
//   }

//   public getRole(): string {
//     const token = localStorage.getItem('token');
//     return this.getRoleFromToken(token);
//   }
// }

