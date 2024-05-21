import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
        loadComponent: () => import('./questions.component').then(m => m.QuestionsComponent),
        data: {
          title: 'Questions'
        }
  }
];


