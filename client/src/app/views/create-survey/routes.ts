import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./create-survey.component').then(m => m.CreateSurveyComponent),
    data: {
      title: 'Create Survey'
    }
  },
  
]