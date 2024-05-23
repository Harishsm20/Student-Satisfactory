import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule,FormGroup } from '@angular/forms';
import { RegisterService } from '../../../service/auth.service';

import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  providers: [RegisterService],
  imports: [ContainerComponent, RowComponent, CommonModule,  ColComponent, ReactiveFormsModule, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  loginForm: FormGroup; // Type changed to FormGroup

  constructor(private router: Router, private fb: FormBuilder, private registerService: RegisterService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }


  navigateToRegisterPage() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    const email = this.loginForm.value.email || '';
    const password = this.loginForm.value.password || '';
    console.log(`Email: ${email},  password:${password}`);
    const requestBody = { email, password };
    this.registerService.login(requestBody)
      .subscribe({
        next: (response) => {
          if(response == "Success"){
            const token = response['token']; 
            localStorage.setItem('token', token);
            console.log("Login successful:", response);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error("Login error:", error);
        }
      });
  }
}
