import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from '../../service/survey.service'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JwtService } from '../../service/jwt.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { User } from '../authentication/shared/user.model';
import { Router } from '@angular/router'; 

interface Question {
  _id: string | undefined;
  text: string;
  options: { text: string }[]; 
  isSelected?: boolean;
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [
    SurveyService,
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService
  ]
})
export class CreateSurveyComponent implements OnInit {
  userRole: string = '';
  faculty: string ='';
  surveyForm: FormGroup = new FormGroup({});
  questionsB: Question[] = []; 
  selectedQuestionIds: string[] = [];
  isChecked = false;



  alertMessage: string = '';
  alertVisible: boolean = false;
  alertType : boolean = false;

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = this.jwtService.getRole(); 
    this.faculty = this.jwtService.getId();
    this.createForm();
    this.fetchAvailableQuestions();
  }

  createForm() {
    this.surveyForm = this.fb.group({
      batch: ['', Validators.required],
      semester:['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questions: [[]] ,

    });
  }

  fetchAvailableQuestions() {
    this.surveyService.getQuestions().subscribe(questions => {
      this.questionsB = questions.map(question => ({
        _id: question._id,
        text: question.text,
        options: question.options
      }));
    });
  }

  onSubmit() {
    if (this.surveyForm.valid && this.selectedQuestionIds.length > 0 && this.userRole == "faculty") { 
      const formValue = this.surveyForm.value;
      const surveyData = {
        ...formValue,
        faculty:this.faculty,
        questions: this.selectedQuestionIds
      };

      this.surveyService.createSurvey(surveyData).subscribe(response => {
        console.log('Survey created successfully!', response);
        this.showAlert('Survey created successfully!', true);
        setTimeout(() => {
          this.surveyForm.reset();
          this.router.navigate(['/survey']); 
        }, 100); 
      }, error => {
        if (error.status === 400 && error.error.message === 'Survey for this batch and semester already exists.') {
          this.showAlert('Survey for this batch and semester already exists.', false);
        } else {
          this.showAlert('Error creating survey. Please try again.', false);
        }
        console.error('Error creating survey:', error);
      });
    } else {
      this.showAlert('Please fill in all required fields and select at least one question.', false);
      console.error('Please fill in all required fields and select at least one question.');
    }
  }

  showAlert(message: string, sign : boolean): void {
    this.alertType = sign;
    this.alertMessage = message;
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 5000);
  }

  onQuestionSelectionChange(questionId: string = "") {
    console.log(this.userRole);
    const questionIndex = this.questionsB.findIndex(question => question._id === questionId);
    if (questionIndex !== -1) {
      this.questionsB[questionIndex].isSelected = !this.questionsB[questionIndex].isSelected;

      if (this.questionsB[questionIndex].isSelected) {
        this.selectedQuestionIds.push(questionId);
      } else {
        const index = this.selectedQuestionIds.indexOf(questionId);
        if (index !== -1) {
          this.selectedQuestionIds.splice(index, 1);
        }
      }
    }

  }
}
