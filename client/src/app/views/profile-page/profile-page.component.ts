import { Component, OnInit } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/service/jwt.service';import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [HttpClientModule,CommonModule],
  standalone: true,
  providers: [{ provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService]

})
export class ProfileComponent implements OnInit {
  
  user: any = {};  
  alertMessage: string = '';
  alertVisible: boolean = false;
  allStudentsSubmitted: boolean = false;
  chartBarData: any;
  chartBarOptions: any;

  constructor(
    private jwtService: JwtService,


  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
    this.loadChart();
    console.log("Reached profile");
  }

  fetchUserProfile() {
    this.user = this.jwtService.getRole(); 

  }

  loadChart() {
    // Example method to load chart data
    this.chartBarData = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    this.chartBarOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
  }
}

  

