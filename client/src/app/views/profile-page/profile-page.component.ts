import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../service/survey.service';
import { JwtService } from '../../service/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};  // Replace with proper user model
  alertMessage: string = '';
  alertVisible: boolean = false;
  allStudentsSubmitted: boolean = false;
  chartBarData: any;
  chartBarOptions: any;

  constructor(
    private surveyService: SurveyService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
    this.initializeChart();
  }

  fetchUserProfile() {
    this.user = this.jwtService.getRole();  
  }

  initializeChart() {
    this.chartBarData = {
      labels: ['Survey 1', 'Survey 2', 'Survey 3'],
      datasets: [
        {
          label: 'Scores',
          data: [65, 59, 80],
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }
      ]
    };

    this.chartBarOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
  }
}
