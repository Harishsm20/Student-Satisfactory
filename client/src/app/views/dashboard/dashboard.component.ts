import { Component } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollapseDirective,CollapseModule,ButtonDirective } from '@coreui/angular'; // Import CollapseDirective
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { DocsCalloutComponent } from '@docs-components/public-api';
import { ChartjsComponent } from '@coreui/angular-chartjs';
@Component({
  selector: 'app-dashboard',
  templateUrl:'./dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [RowComponent,ButtonDirective, CardBodyComponent, CollapseModule, CollapseDirective,ColComponent, DocsCalloutComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ChartjsComponent]
})
export class DashboardComponent {
  visible = false;

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  
 
  options = {
    maintainAspectRatio: false
  };

  questions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  chartBarData: ChartData = {
    labels: [...this.questions].slice(1, 16),
    datasets: [
      {
        label: 'Surevy Points',
        backgroundColor: '#f87979',
        data: [2.6, 3.8, 4.2, 3.6, 2.5, 5, 3.4, 1.9, 2.9, 5,1.2,3.6,3.4,2.5,4]
      }
    ]
  };

  chartBarOptions = {
    maintainAspectRatio: false,
  };

  get randomData() {
    return Math.round(Math.random() * 100);
  }
}

