import { Routes } from '@angular/router';
import { StudyDetailsComponent } from '../study-details/study-details.component';


export const routes: Routes = [
    { path: 'study-details', component: StudyDetailsComponent },
    { path: '', redirectTo: '/study-details', pathMatch: 'full' },
  ];