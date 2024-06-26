import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile-page.component').then(m => m.ProfileComponent),
    data: {
      title: 'Create Survey'
    }
  },
  
]