import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,NgModel, FormArray } from '@angular/forms';
import { SurveyService } from '../../service/survey.service'; // Import SurveyService
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { JwtService } from '../../service/jwt.service';
import { JwtHelperService } from '@auth0/angular-jwt';



// Update Question interface to match backend schema
interface Question {
  _id: string|undefined;
  text: string;
  options: { text: string }[]; // Array of objects with text property
  isSelected?: boolean;

}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [JwtHelperService,SurveyService] 
})
export class CreateSurveyComponent implements OnInit {
  decodeJwtToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
  }
  userRole: string = '';

  surveyForm: FormGroup = new FormGroup({});
  questions: Question[] = []; // Array to store available questions
  selectedQuestionIds: string[] = []; // Array to store selected question IDs
  isChecked = false;

  constructor(
    private fb: FormBuilder, 
    private surveyService: SurveyService ,
    private jwtService: JwtService 
  ) { }

  ngOnInit(): void {
    // this.userRole = this.jwtService.getRole()
    this.createForm();
    this.fetchAvailableQuestions();
  }

  createForm() {
    this.surveyForm = this.fb.group({
      batch: ['', Validators.required],
      // description: ['', Validators.required],  // Uncomment if description is required
      semester: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionIds: [[]] // Array to store selected question IDs
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
    if (this.surveyForm.valid && this.selectedQuestionIds.length > 0) { // Ensure some questions are selected
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

  onQuestionSelectionChange(questionId: string="") {
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
