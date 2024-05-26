import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from '../../service/survey.service'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JwtService } from '../../service/jwt.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

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

  surveyForm: FormGroup = new FormGroup({});
  questions: Question[] = []; 
  selectedQuestionIds: string[] = [];
  isChecked = false;

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private jwtService: JwtService 
  ) { }

  ngOnInit(): void {
    this.userRole = this.jwtService.getRole(); 
    this.createForm();
    this.fetchAvailableQuestions();
  }

  createForm() {
    this.surveyForm = this.fb.group({
      batch: ['', Validators.required],
      semester: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionIds: [[]] 
    });
  }

  fetchAvailableQuestions() {
    this.surveyService.getQuestions().subscribe(questions => {
      this.questions = questions.map(question => ({
        _id: question._id,
        text: question.text,
        options: question.options
      }));
    });
  }

  onSubmit() {
    if (this.surveyForm.valid && this.selectedQuestionIds.length > 0) { 
      const formValue = this.surveyForm.value;
      const surveyData = {
        ...formValue,
        questions: this.selectedQuestionIds
      };

      this.surveyService.createSurvey(surveyData).subscribe(response => {
        console.log('Survey created successfully!', response);
      }, error => {
        console.error('Error creating survey:', error);
      });
    } else {
      alert('Please fill in all required fields and select at least one question.');
      console.error('Please fill in all required fields and select at least one question.');
    }
  }

  onQuestionSelectionChange(questionId: string = "") {
    console.log(this.userRole);
    const questionIndex = this.questions.findIndex(question => question._id === questionId);
    if (questionIndex !== -1) {
      this.questions[questionIndex].isSelected = !this.questions[questionIndex].isSelected;

      if (this.questions[questionIndex].isSelected) {
        this.selectedQuestionIds.push(questionId);
      } else {
        const index = this.selectedQuestionIds.indexOf(questionId);
        if (index !== -1) {
          this.selectedQuestionIds.splice(index, 1);
        }
      }
    }
     // if(this.selectedQuestionIds.length>0){
    //   console.table(this.selectedQuestionIds);
    // }
    // else{
    //   console.log("Empty array");
    // }
  }
}
