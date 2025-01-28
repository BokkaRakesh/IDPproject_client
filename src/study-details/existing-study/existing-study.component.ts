import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import saveAs from 'file-saver';
import { StudyService } from '../services/study.service';

@Component({
  selector: 'app-existing-study',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './existing-study.component.html',
  styleUrls: ['./existing-study.component.scss'],
})
export class ExistingStudyComponent implements OnInit {
  @Input() mode: 'new' | 'existing' = 'existing';
  searchQuery: string = ''; // Query for search functionality
  selectedStudy: any = null; // Currently selected study
  selectedStudyId: string | null = null; // ID of the selected study
  selectedStudyName: string | null = null; // ID of the selected study
  studies: any[] = []; // Data for existing studies (to populate TreeTable)
  filteredStudies: any[] = []; // List of filtered studies based on the search query
  studyForm!: FormGroup; // The reactive form to edit the selected study
  statusOptions = [
    { label: 'Not yet started', value: 'notyetstarted' },
    { label: 'In progress', value: 'inProgress' },
    { label: 'Complete', value: 'complete' },
    { label: 'Not Applicable', value: 'notApplicable' },
  ];

  // Flag to check if form is in edit mode
  isEditable: boolean = false;
  isLoading: boolean = false;

  constructor(
    private studyService: StudyService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.getStudies();
  }
  getStudies(): void {
    this.isLoading = true;
    this.studyService.getStudies().subscribe({
      next: (response:any) => {
        this.studies = response.studies
        this.filteredStudies = [...this.studies];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching studies:', err);
        this.isLoading = false;
      },
      complete: () => {
        console.log('Studies fetched successfully', this.filteredStudies);
        console.log('this.studies', this.studies);
        console.log('Studies fetched successfully');
      }
    });
  }
  // Filter studies based on the search query
  filterStudies(): void {
    if (this.searchQuery) {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      this.filteredStudies = this.studies.filter(
        (study) =>
          study?.studyId?.toLowerCase().includes(lowerCaseQuery) ||
          study?.studyName?.toLowerCase().includes(lowerCaseQuery)
      );
    } else {
      this.filteredStudies = [...this.studies];
    }
  }
  isStudyVisible(study: any): boolean {
    // Check if the study matches the selected study ID or name, or if no filters are applied
    const matchesStudyId = !this.selectedStudyId || study.studyId === this.selectedStudyId;
    const matchesStudyName = !this.selectedStudyName || study.studyName === this.selectedStudyName;
  
    return matchesStudyId && matchesStudyName;
  }
  
  // Method to handle individual study selection
  onSelectStudy(study: any) {
    this.selectedStudyId = study.studyId; // Set the selected study ID
    this.selectedStudyName = study.studyName
    this.selectedStudy = study;
    console.log("selectedStudy",study);
    this.initializeForm(); // Initialize the form for the selected study
  }

  clearSelection() {
    this.selectedStudyId = null;
    this.selectedStudyName = null;
    this.selectedStudy = null;
    this.studyForm.reset();
  }

  private initializeForm() {
    const fieldsGroup: any = {};
  
    // Add studyId and studyName to the form group
    fieldsGroup['studyId'] = [{ value: this.selectedStudy.studyId, disabled: true }];
    fieldsGroup['studyName'] = [ { value: this.selectedStudy.studyName, disabled: true }];
  
    // Add dynamic fields
    this.selectedStudy.fields.forEach((field: any) => {
      fieldsGroup[field.key] = [{value:field.status, disabled: true}, Validators.required]; // Field status control
      fieldsGroup[field.key + '_comment'] = [{value:field.comment, disabled: true}]; // Field comment control
    });
  
    // Initialize the form group
    this.studyForm = this.fb.group(fieldsGroup);
  }

  // Toggle edit mode
  onToggleEditMode() {
   
    if (!this.isEditable) {
      this.studyForm.disable();
    } else {
      //Save the current state before disabling
      // const currentFormValue = this.studyForm.getRawValue();
      // this.studyForm.reset(currentFormValue);
      this.studyForm.enable();
      
    }
    this.studyForm.get('studyId')?.disable();
    this.studyForm.get('studyName')?.disable();
  }

  onSubmit() {
    if (this.studyForm.valid) {
      const formData = this.studyForm.getRawValue(); // Include disabled fields like studyId

      const updatedStudyData = {
        studyId: formData.studyId || null,
        studyName: formData.studyName || null, // Capture updated studyName
        fields: Object.keys(formData)
          .filter((key) => key !== 'studyId' && key !== 'studyName') // Exclude non-field keys
          .filter((key) => !key.endsWith('_comment')) // Handle comments separately
          .map((key) => ({
            key: key, // Form key (from the form)
            label: this.selectedStudy.fields.find((field: any) => field.key === key)?.label || '',
            status: formData[key], // Get updated status value from form
            comment: formData[key + '_comment'] || '', // Get updated comment from form
          })),
        createdAt: this.selectedStudy.createdAt,
        updatedAt: new Date().toISOString(), // Capture the updated timestamp
      };
      
      console.log("formData",formData, this.selectedStudy, updatedStudyData);
      this.studyService.updateStudyData(formData.studyId,updatedStudyData).subscribe({
        next: () => {
          alert('Study data updated successfully');
          this.refreshStudies();
          this.studyForm.reset();
          this.selectedStudy = null;
        },
        error: (error) => {
          alert('Error updating study data');
          console.error('Error updating study data:', error);
        },
      });
    }
  }

  // Refresh the studies list
  refreshStudies() {
    this.clearSelection();
    this.isEditable = false;
    this.studyService.getStudies().subscribe({
      next: (response:any) => {
        this.studies = []
        this.studies = response.studies
        this.filteredStudies = [];
        this.filteredStudies = [...this.studies]; // Ensure filtered studies is updated
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        console.error('Error refreshing studies:', err);
      },
    });
  }

}
