import { Component, OnInit } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { JwtService } from 'src/app/service/jwt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [HttpClientModule, CommonModule, FormsModule], // Add FormsModule to imports
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
  isEditingName: boolean = false;

  constructor(
    private jwtService: JwtService,
  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
    console.log("Reached profile");
  }

  fetchUserProfile() {
    this.user = this.jwtService.getUserDetails();
  }



  toggleEditName() {
    this.isEditingName = !this.isEditingName;
    if (!this.isEditingName) {
      console.log('Name saved:', this.user.name);
    }
  }
}
