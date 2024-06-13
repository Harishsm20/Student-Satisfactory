import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 // Needed for route parameters and navigation
 import { SurveyService } from '../../service/survey.service'; 
 import { JwtService } from '../../service/jwt.service';
 import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

 interface Question {
  _id: string | undefined;
  text: string;
  options: { text: string }[]; 
  optionsSelected?: { [key: string]: boolean }; 
  isSelected?: boolean;
  selectedOption?: number;
}
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, CommonModule,],
  providers: [SurveyService,
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService
  ] 
})
export class QuestionsComponent implements OnInit {
  userRole: string = '';
  userBatch: string = '';
  questions: Question[] = []; 
  selectedQuestionIds: string[] = [];
  survey: any;
  filteredSurvey: any;
  isSurveyOpen = false;
  selectedSemester: string = '';
  answer: string = '';

  // for filter and visibility
  visible = false;
  isFilterOpen = false; 


  alertMessage: string = '';
  alertVisible: boolean = false;
  alertVisible2: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private jwtService: JwtService 
  ) {}

  ngOnInit(): void {
    this.fetchAvailableQuestions();
    this.userBatch = this.jwtService.getbatch(); 
    this.userRole = this.jwtService.getRole();
    // this.fetchSurvey();
  }

  fetchSurvey() {
    this.surveyService.getSurveyByBatch(this.userBatch, this.selectedSemester)
      .subscribe(
        response => {
          this.survey = response;
          console.log('Survey response:', this.survey);
          this.checkSurveyDates();
          this.applyFilters();
        },
        error => {
          this.showAlert('The selected semester or survey is closed for submissions.');

          console.error('Error fetching survey:', error);
          // Handle error accordingly
        }
      );
  }

  checkSurveyDates() {
    const currentDate = new Date();
    const startDate = new Date(this.survey.startDate);
    const endDate = new Date(this.survey.endDate);

    console.log(currentDate);
    if (currentDate >= startDate && currentDate <= endDate) {
      
      this.isSurveyOpen = this.selectedSemester === this.survey.semester;
      console.log(this.isSurveyOpen);
    } else {
      this.isSurveyOpen = false;
      console.log("SIuuuu")
    }
  }


  fetchAvailableQuestions() {
    console.log("Fetch function reached");
    this.surveyService.getQuestions().subscribe(questions => {
      console.log("Getting Questions");
      this.questions = questions.map(question => ({
        _id: question._id,
        text: question.text,
        options: question.options
      }));
      console.table(this.questions);
    });
  }

  onSemesterChange(value: string) {
    this.selectedSemester = value;
    this.fetchSurvey();
  }

  applyFilters() {
    console.log(`this.survey: ${this.survey}`);
    if (this.survey && this.survey.semester === this.selectedSemester) {
      this.checkSurveyDates();
      console.log(` \n\napply filter : ${this.survey}`)
      if (this.isSurveyOpen) {
        this.filteredSurvey = this.survey;
      } else {
        this.filteredSurvey = null;
        this.showAlert('The selected semester or survey is closed for submissions.');

      }
    } else {
      this.filteredSurvey = null;
      this.showAlert('Survey not found for the selected semester or survey is closed for submissions.')

    }
  }
  showAlert(message: string) {
    this.alertVisible2 = true;
    setTimeout(() => {
      this.alertVisible2 = false;
    }, 2000); 
  }

  submitSurvey() {
    const surveyResponses = this.questions.map((question, index) => ({
      questionNo: index + 1,
      text: question.text,
      option1: question.selectedOption === 1 ? 1 : 0,
      option2: question.selectedOption === 2 ? 1 : 0,
      option3: question.selectedOption === 3 ? 1 : 0,
      option4: question.selectedOption === 4 ? 1 : 0,
      option5: question.selectedOption === 5 ? 1 : 0,
    }));
  
    const surveySubmission = {
      questions: surveyResponses,
      batch: this.filteredSurvey.batch,
      semester: this.filteredSurvey.semester
    };
  
    // Log the survey submission to check the structure
    surveySubmission.questions.forEach((question) => {
      console.log(`Question No: ${question.questionNo}`);
      console.log(`Text: ${question.text}`);
      console.log(`Option 1: ${question.option1}`);
      console.log(`Option 2: ${question.option2}`);
      console.log(`Option 3: ${question.option3}`);
      console.log(`Option 4: ${question.option4}`);
      console.log(`Option 5: ${question.option5}`);
    });
  
    this.surveyService.submitSurvey(surveySubmission).subscribe(
      response => {
        this.alertMessage = `Thankyou for submiiting the survey for ${this.selectedSemester}`;
        this.alertVisible = true;

        console.log('Survey submitted successfully:', response);        
      },
      error => {
        console.error('Error submitting survey:', error);
      }
    );
  }
  
  
  submitStudentResponse() {
    const studentResponse = {
      batch: this.userBatch,
      semester: this.selectedSemester,
      studentRollNo: this.jwtService.getRollNo()
    };

    console.log(studentResponse);
  
    this.surveyService.submitStudentResponse(studentResponse).subscribe(
      response => {
        console.log('Student response submitted successfully:', response);
        this.submitSurvey();
      },
      error => {
        this.alertMessage = `Survey Already submitted! for ${this.selectedSemester}`;
        this.alertVisible = true;
        console.error('Error submitting student response:', error);
      }
    );
  }




  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }
  toggleCollapse() {
    this.visible = !this.visible;
  }

}