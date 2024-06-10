import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollapseDirective, CollapseModule, ButtonDirective } from '@coreui/angular';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { DocsCalloutComponent } from '@docs-components/public-api';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { SurveyService } from '../../service/survey.service'; // Adjust the path as needed
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { JwtService } from 'src/app/service/jwt.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    RowComponent,
    ButtonDirective,
    CardBodyComponent,
    CollapseModule,
    CollapseDirective,
    ColComponent,
    DocsCalloutComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    ChartjsComponent,
    FormsModule, // For ngModel
    CommonModule

  ],
  providers: [SurveyService, 
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService]
})
export class DashboardComponent implements OnInit{

  constructor(
    private jwtService: JwtService,
    private surveyService: SurveyService
  ) { }
  userRole: string ='';
  ngOnInit(): void {
    this.userRole = this.jwtService.getRole(); 
  }


  visible = false;
  selectedBatch: string = '';
  selectedSemester: string = '';
  selectedQuestion: number = 1; // Default question number
  questions = Array.from({ length: 15 }, (_, i) => i + 1); // 1 to 15

  pendingStudents: any[] = [];
  allStudentsSubmitted = false;

  chartBarData: ChartData<'bar'> = {
    labels: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    datasets: [
      {
        label: 'Survey Points',
        backgroundColor: '#f87979',
        data: [] // Initialize with an empty array
      }
    ]
  };

  chartBarOptions = {
    maintainAspectRatio: false,
  };

  // constructor() {}

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  applyFilters(): void {
    if (this.selectedBatch && this.selectedSemester && this.selectedQuestion) {
      console.log(`${this.selectedBatch}, ${this.selectedQuestion}, ${this.selectedSemester}`);
      this.surveyService.getResponseData(this.selectedBatch, this.selectedSemester, this.selectedQuestion).subscribe(
        response => {
          console.log(response);
          if (response && response.questions && response.questions.length > 0) {
            const questionData = response.questions[0];
            this.chartBarData.datasets[0].data = [
              questionData.option1,
              questionData.option2,
              questionData.option3,
              questionData.option4,
              questionData.option5
            ];
            this.chartBarData = { ...this.chartBarData }; 
          }
        },
        error => {
          console.error('Error fetching response data:', error);
        }
      );

      this.surveyService.getPendingStudents(this.selectedBatch, this.selectedSemester).subscribe(
        (response: any) => {
          console.log(response)
          console.log('Pending students:', response.pendingStudents);
          this.pendingStudents = response.pendingStudents;
          this.pendingStudents = response.pendingStudents.map((student: any) => ({
            rollNo: student.RollNo,
            name: student.username,
            email: student.email
          }));

        this.allStudentsSubmitted = this.pendingStudents.length === 0;

        },
        error => {
          console.error('Error fetching pending students:', error);
        }
      );
    
    }
  }
}
