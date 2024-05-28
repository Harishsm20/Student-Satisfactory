import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 // Needed for route parameters and navigation
 import { SurveyService } from '../../service/survey.service'; // Import your Survey service
 interface Question {
  _id: string | undefined;
  text: string;
  options: { text: string }[]; 
  isSelected?: boolean;
}
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SurveyService] 
})
export class QuestionsComponent implements OnInit {
  questionsB: Question[] = []; 
  selectedQuestionIds: string[] = [];
  survey: any; // Placeholder for survey data
  isSurveyOpen = false;
  selectedSemester: string = '';
  answer: string = ''; // Property to hold user's answer (if needed)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService
  ) {}

  ngOnInit(): void {
    this.fetchAvailableQuestions();
  }
  fetchAvailableQuestions() {
    console.log("Fetch function reached");
    this.surveyService.getQuestions().subscribe(questions => {
      console.log("Getting Questions");
      this.questionsB = questions.map(question => ({
        _id: question._id,
        text: question.text,
        options: question.options
      }));
      console.log(this.questionsB);
    });
  }
  onQuestionSelectionChange(questionId: string = "") {
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
