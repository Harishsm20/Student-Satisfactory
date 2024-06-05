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
  userBatch: string = '' ;
  questions: Question[] = []; 
  selectedQuestionIds: string[] = [];
  survey: any; // Placeholder for survey data
  filteredSurvey: any;
  isSurveyOpen = false;
  selectedSemester: string = '';
  answer: string = ''; // Property to hold user's answer (if needed)

  // for filter and visibility
  visible = false;
  isFilterOpen = false; 

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
    this.fetchSurvey();
  }

  fetchSurvey() {
    this.surveyService.getSurveyByBatch(this.userBatch)
      .subscribe(
        response => {
          this.survey = response;
          console.log('Survey response:', response);
          this.checkSurveyDates();
        },
        error => {
          console.error('Error fetching survey:', error);
          // Handle error accordingly
        }
      );
  }

  checkSurveyDates() {
    const currentDate = new Date();
    const startDate = new Date(this.survey.startDate);
    const endDate = new Date(this.survey.endDate);

    if (currentDate >= startDate && currentDate <= endDate) {
      
      this.isSurveyOpen = this.selectedSemester === this.survey.semester;
    } else {
      this.isSurveyOpen = false;
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


  onQuestionSelectionChange(questionId: string="", optionText: string="") {
    console.log(`Batch : ${this.userBatch}`);
    console.log(`role : ${this.userRole}`);
    this.surveyService.getSurveyByBatch(this.userBatch);

  const questionIndex = this.questions?.findIndex(question => question._id === questionId);
  if (questionIndex !== -1) {
    const question = this.questions[questionIndex];
    
    if (!question.optionsSelected) {
      question.optionsSelected = {}; // Initialization if not present
    }
    question.optionsSelected[optionText] = !question.optionsSelected[optionText] || false;

    const isSelected = question.optionsSelected[optionText];
    if (isSelected) {
      // Option selected, add questionId-optionText pair to selectedQuestionIds
      this.selectedQuestionIds.push(`${questionId}-${optionText}`);
    } else {
      // Option deselected, remove questionId-optionText pair from selectedQuestionIds
      const index = this.selectedQuestionIds.indexOf(`${questionId}-${optionText}`);
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
  onSemesterChange(value: string) {
    this.selectedSemester = value;
    this.applyFilters();
  }

  applyFilters() {
    if (this.survey && this.survey.semester === this.selectedSemester) {
      this.checkSurveyDates();
      if (this.isSurveyOpen) {
        this.filteredSurvey = this.survey;
      } else {
        this.filteredSurvey = null;
      }
    } else {
      this.filteredSurvey = null;
    }
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
        console.log('Survey submitted successfully:', response);
        // Handle successful submission (e.g., navigate to a confirmation page)
      },
      error => {
        console.error('Error submitting survey:', error);
        // Handle error during submission
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