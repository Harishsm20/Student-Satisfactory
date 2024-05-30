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
  isSurveyOpen = false;
  selectedSemester: string = '';
  answer: string = ''; // Property to hold user's answer (if needed)

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
    this.surveyService.getSurveyByBatch(this.userBatch);
    console.log( ` check response:  ${this.surveyService.getSurveyByBatch(this.userBatch) }` )
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

}













  // getFilteredSurveys() {
  //   this.surveyService.getFilteredSurveys({ semester: this.selectedSemester })
  //     .subscribe(surveys => {
  //       const surveyId = this.route.snapshot.paramMap.get('surveyId');
  //       if (!surveyId) {
  //         this.router.navigate(['/surveys']); // Redirect if no survey ID found
  //         return;
  //       }

  //       const foundSurvey = surveys.find(survey => survey._id === surveyId);
  //       if (foundSurvey) {
  //         this.survey = foundSurvey;
  //         this.isSurveyOpen = this.checkIfSurveyOpen(this.survey);
  //       } else {
  //         // Handle case where survey is not found (e.g., display message)
  //         this.router.navigate(['/surveys']);
  //       }
  //     });
  // }

  // checkIfSurveyOpen(survey: any) {
  //   const today = new Date();
  //   return survey && survey.startDate <= today && survey.endDate >= today;
  // }

  // onSemesterChange(semester: string) {
  //   this.selectedSemester = semester;
  //   this.getFilteredSurveys(); // Re-fetch surveys based on the selected semester
  // }

//   submitSurvey() {
//     console.log('Survey submitted!', this.answer); // Include answer in logs (if used)
//     // Implement logic to send survey answers to your backend API
//   }
// }
