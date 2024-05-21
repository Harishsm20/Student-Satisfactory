import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 // Needed for route parameters and navigation
 import { SurveyService } from '../../service/survey.service'; // Import your Survey service
interface Question {
  _id?: string; // Optional ID for questions
  text: string;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class QuestionsComponent implements OnInit {
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
    this.getFilteredSurveys();
  }

  getFilteredSurveys() {
    this.surveyService.getFilteredSurveys({ semester: this.selectedSemester })
      .subscribe(surveys => {
        const surveyId = this.route.snapshot.paramMap.get('surveyId');
        if (!surveyId) {
          this.router.navigate(['/surveys']); // Redirect if no survey ID found
          return;
        }

        const foundSurvey = surveys.find(survey => survey._id === surveyId);
        if (foundSurvey) {
          this.survey = foundSurvey;
          this.isSurveyOpen = this.checkIfSurveyOpen(this.survey);
        } else {
          // Handle case where survey is not found (e.g., display message)
          this.router.navigate(['/surveys']);
        }
      });
  }

  checkIfSurveyOpen(survey: any) {
    const today = new Date();
    return survey && survey.startDate <= today && survey.endDate >= today;
  }

  onSemesterChange(semester: string) {
    this.selectedSemester = semester;
    this.getFilteredSurveys(); // Re-fetch surveys based on the selected semester
  }

  submitSurvey() {
    console.log('Survey submitted!', this.answer); // Include answer in logs (if used)
    // Implement logic to send survey answers to your backend API
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { DocsExampleComponent } from '@docs-components/public-api';
// import { CollapseDirective,CollapseModule,ButtonDirective } from '@coreui/angular'; // Import CollapseDirective
// import { CommonModule } from '@angular/common';
// import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';
// // Needed for route parameters and navigation
// import { SurveyService } from '../../service/survey.service'; // Import your Survey service

// @Component({
//   selector: 'app-questions',
//   templateUrl: './questions.component.html',
//   styleUrls: ['./questions.component.scss'],
//   standalone: true,
//   imports: [CollapseDirective,CollapseModule,Comm,ButtonDirective,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective]
//  })
// export class QuestionsComponent implements OnInit {
//   survey: any;
//   isSurveyOpen = false;
//   selectedSemester: string = ''; 

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private surveyService: SurveyService 
//   ) { }

//   ngOnInit(): void {
//     this.getFilteredSurveys();
//   }

//   getFilteredSurveys() {
//     this.surveyService.getFilteredSurveys({ semester: this.selectedSemester })
//       .subscribe(surveys => {
//         const surveyId = this.route.snapshot.paramMap.get('surveyId');
//         if (!surveyId) {
//           this.router.navigate(['/surveys']); // Redirect if no survey ID found
//           return;
//         }
//         const foundSurvey = surveys.find(survey => survey._id === surveyId);
//         if (foundSurvey) {
//           this.survey = foundSurvey; // Use survey only if found
//           this.isSurveyOpen = this.checkIfSurveyOpen(this.survey);
//         } else {
//           // Handle case where survey is not found
//           this.router.navigate(['/surveys']);
//         }
//       });
//   }
//   checkIfSurveyOpen(survey: any) {
//     const today = new Date();
//     return survey && survey.startDate <= today && survey.endDate >= today;
//   }

//   // Add a method to handle semester selection from the filter dropdown (assuming UI interaction)
//   onSemesterChange(semester: string) {
//     this.selectedSemester = semester;
//     this.getFilteredSurveys(); // Re-fetch surveys based on the selected semester
//   }

//   submitSurvey() {
//     console.log('Survey submitted!');
//     // Replace with logic to send survey answers to your backend API
//   }
// }


// import { Component } from '@angular/core';
// import { DocsExampleComponent } from '@docs-components/public-api';
// import { CollapseDirective,CollapseModule,ButtonDirective } from '@coreui/angular'; // Import CollapseDirective

// import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';

// @Component({
//     selector: 'app-questions',
//     templateUrl: './questions.component.html',
//     styleUrls: ['./questions.component.scss'],
//     standalone: true,
//     imports: [CollapseDirective,CollapseModule,ButtonDirective,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective]
// })
// export class QuestionsComponent {
//   visible = false;

//   toggleCollapse(): void {
//     this.visible = !this.visible;
//   }


//   constructor() { }

// }

