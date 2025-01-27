import { Routes } from '@angular/router';
import { StudyDetailsComponent } from '../study-details/study-details.component';
import { StudyFormComponent } from '../study-details/study-form/study-form.component';

export const routes: Routes = [
    { path: 'study-details', component: StudyDetailsComponent },
    { path: '', redirectTo: '/study-details', pathMatch: 'full' },
  ];