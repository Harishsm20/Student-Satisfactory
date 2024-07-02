import { Component, OnInit } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { JwtService } from 'src/app/service/jwt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProfileService} from '../../service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [HttpClientModule, CommonModule, FormsModule], // Add FormsModule to imports
  standalone: true,
  providers: [{ provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService, ProfileService]
})
export class ProfileComponent implements OnInit {

  user: any = {};
  alertMessage: string = '';
  alertVisible: boolean = false;
  allStudentsSubmitted: boolean = false;
  chartBarData: any;
  chartBarOptions: any;
  isEditingName: boolean = false;

  showEdit: boolean = false;


  constructor(
    private jwtService: JwtService,
    private profileService: ProfileService,
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
      this.updateUserName(this.user.rollNo, this.user.name);
    }
  }

  updateUserName(rollNo: string, name: string) {
    this.profileService.updateUserName(rollNo, name).subscribe(
      (response: any) => {
        console.log('Name updated successfully', response);
        this.alertMessage = 'Name updated successfully';
        this.alertVisible = true;
        setTimeout(() => {
          this.alertVisible = false;
        }, 3000); // Hide the alert after 3 seconds
      },
      (error: any) => {
        console.error('Error updating name', error);
        this.alertMessage = 'Error updating name';
        this.alertVisible = true;
        setTimeout(() => {
          this.alertVisible = false;
        }, 3000); // Hide the alert after 3 seconds
      }
    );
  }
}
