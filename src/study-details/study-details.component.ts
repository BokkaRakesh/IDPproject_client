import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StudyFormComponent } from './study-form/study-form.component';
import { FormsModule } from '@angular/forms'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StudyService } from './services/study.service';
import { ExistingStudyComponent } from './existing-study/existing-study.component';

@Component({
  selector: 'app-study-details',
  standalone: true,
  imports: [CommonModule, FormsModule, StudyFormComponent,ExistingStudyComponent],
  templateUrl: './study-details.component.html',
  styleUrls: ['./study-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudyDetailsComponent implements OnInit {
 @Input() selectedOption: string = 'new'; // Default selection for form mode
  constructor(private studyService: StudyService) { }
  ngOnInit(): void {
  }
    
}
