import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Add this import
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RegisterService } from '../../../service/auth.service'; // Import your service
import { User } from '../shared/user.model';
import { HttpClientModule , HttpClient} from '@angular/common/http';
import { IconDirective } from '@coreui/icons-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import {  CardHeaderComponent,  FormLabelDirective,  FormFeedbackComponent,  FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,  ListGroupDirective, ListGroupItemDirective } from '@coreui/angular';

// import {CFormCheckModule} ;
import { ContainerComponent, RowComponent ,ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  providers: [HttpClient, RegisterService],
  imports: [ContainerComponent,ReactiveFormsModule,HttpClientModule,CommonModule,FormsModule,DocsExampleComponent, RowComponent, ColComponent, TextColorDirective, CardHeaderComponent,  FormLabelDirective,  FormFeedbackComponent,  FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,  ListGroupDirective, ListGroupItemDirective , CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class RegisterComponent {
  

  registrationForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    RollNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12), this.alphanumericValidator()]],
    department: ['', [ ]], // Add department property
  role: ['', [ ]], // Add role property
  batch: ['', [ ]], // Add role property
  });

  constructor(private fb: FormBuilder, private router: Router,private registerService: RegisterService) { }

  get username() { return this.registrationForm.get('username'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get RollNo() { return this.registrationForm.get('RollNo'); }
  get department() { return this.registrationForm.get('department'); }
  get role() { return this.registrationForm.get('role'); }
  get batch() { return this.registrationForm.get('batch'); }

  selectedRole: string = ''; // Variable to store selected role


  // Method to handle role change event
  onRoleChange(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;
    console.log(`role : ${selectedRole}`);
    this.selectedRole = selectedRole; // Update selectedRole

    
    // Now you can use the selectedValue as needed
  }
  
  alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(value);
      return !isAlphanumeric || hasSpecialChars ? { 'alphanumeric': { value: value } } : null;
    };
  }



  toLoginPage() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    console.log("button reached");
    if (this.registrationForm.valid) {
      const user: User = {
        username: this.registrationForm.value.username || '', // Set empty string as default
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        // confirmPassword: this.registrationForm.value.confirmPassword || '' ,
        RollNo: this.registrationForm.value.RollNo || '',
        department: this.registrationForm.value.department || '', // Set empty string as default (optional)
        role: this.registrationForm.value.role || '', // Set empty string as default (optional)
        batch: this.registrationForm.value.batch || '', // Set empty string as default (optional)
      };
      this.registerService.registerUser(user)
        .subscribe(
          response => {
            console.log('Registration successful:', response);
            this.toLoginPage(); // Redirect after successful registration
          },
          error => {
            console.error('Registration failed:', error);
            // Handle registration error (e.g., display error message)
          }
        );
    }
  }
}


