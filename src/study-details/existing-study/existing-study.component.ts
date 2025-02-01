import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import saveAs from 'file-saver';
import { StudyService } from '../services/study.service';
import { of } from "rxjs";
import { debounceTime, map, catchError } from "rxjs/operators";

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
  fields = [
    { key: 'requestNewData', label: 'Request for new data Ingestion' },
    { key: 'jiraCreation', label: 'Jira creation in ICDP Dashboard' },
    { key: 'apolloMetaRequest', label: 'Apollo Meta request creation and approval' },
    { key: 'idtaCreation', label: 'IDTA creation and approval' },
    { key: 's3Bucket', label: 'S3 bucket creation and testing with the vendor' },
    { key: 'sampleDataTransfer', label: 'Sample data transfer with transfer log' },
    { key: 'sampleDataVerificationS3', label: 'Sample data verification on S3' },
    { key: 'sampleDataValidationFlywheel', label: 'Sample data validation on Flywheel' },
    { key: 'sampleDataIngestionConfirmation', label: 'Sample data ingestion confirmation to the vendor' },
    { key: 'gearsCurationTags', label: 'Gears+Curation+Tags Verification' },
    { key: 'fullDatasetTransfer', label: 'Full dataset transfer by the vendor' },
    { key: 'fullDatasetVerificationS3', label: 'Full dataset verification on S3' },
    { key: 'fullDatasetIngestionFlywheel', label: 'Full dataset ingestion on Flywheel' },
    { key: 'fullDatasetValidationVendor', label: 'Full dataset validation confirmation to the vendor' },
    { key: 'onboardingDocs', label: 'Onboarding documentation' },
    { key: 'dataIngestionChecklist', label: 'Data Ingestion Checklist' },
    { key: 'closeLoopVendor', label: 'Close the loop with the vendor' },
    { key: 'datasetAvailability', label: 'Dataset availability confirmation to the study teams' },
    { key: 'dataAccessRequests', label: 'Data access requests by the users' },
    { key: 'dataAccessJiraCreation', label: 'Data access jira creation in ICDP' },
    { key: 'dataAccessCompletion', label: 'Data access completion by the data managers' },
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
      next: (response: any) => {
        this.studies = response.studies.map((study: any) => ({
          ...study,
          status: this.computeStudyStatus(study.fields) // Compute status dynamically
        }));
  
        this.filteredStudies = [...this.studies]; // Refresh filtered studies
        this.isLoading = false;
  
        // Force Angular UI update
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching studies:', err);
        this.isLoading = false;
      }
    });
  }
  
  
  
  
  // Compute the overall study status based on the fields array
  computeStudyStatus(fields: any[]): string {
    if (!fields || fields.length === 0) {
      return 'notApplicable'; // Default if no fields exist
    }
  
    // If any field is "inProgress", mark study as "In Progress"
    if (fields.some((field) => field.status === 'inProgress')) {
      return 'inProgress';
    }
  
    // If all fields are "notyetstarted", mark as "NA"
    if (fields.every((field) => field.status === 'notyetstarted')) {
      return 'notApplicable';
    }
  
    return 'complete'; // Otherwise, consider study as "Complete"
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
  
    // Add studyId and studyName with validators
    fieldsGroup['uId'] = [this.selectedStudy.uID];
    fieldsGroup['studyId'] = [
      { value: this.selectedStudy.studyId, disabled: true },
      [Validators.required],
      [this.checkStudyIdValidator.bind(this)] // Async Validator
    ];
    fieldsGroup['studyName'] = [
      { value: this.selectedStudy.studyName, disabled: true },
      [Validators.required]
    ];
  
    // Collect all required fields for validation
    const requiredFields: string[] = [];

    this.selectedStudy.fields.forEach((field: any) => {
      fieldsGroup[field.key] = [{ value: field.status, disabled: false }, Validators.required];
      fieldsGroup[field.key + '_comment'] = [{ value: field.comment, disabled: false }];
      requiredFields.push(field.key);
    });
  
    this.studyForm = this.fb.group(fieldsGroup, {
      validators: [this.atLeastOneRequiredValidator('studyId', 'studyName', requiredFields)],
    });
  
    this.studyForm.updateValueAndValidity({ emitEvent: true });
  
    console.log('Form initialized, Status:', this.studyForm.status);
  }
  
  logForm() {
    console.log('Form Status:', this.studyForm.status);
    console.log('Form Errors:', this.studyForm.errors); // Log group-level errors
    console.log('Form Values:', this.studyForm.getRawValue());
  
    this.studyForm.statusChanges.subscribe((status) => {
      console.log('Form Status Updated:', status);
      console.log('Form Errors:', this.studyForm.errors);
    
      Object.keys(this.studyForm.controls).forEach((controlName) => {
        const control = this.studyForm.get(controlName);
        console.log(
          `Control: ${controlName}, Status: ${control?.status}, Errors:`,
          control?.errors
        );
      });
    });
  
    console.log('Group-Level Errors:', this.studyForm.errors); // Specifically check form-level errors
  }
  
  
 checkStudyIdValidator(control: AbstractControl) {
  if (!control.value) {
    return of(null); // No validation if empty
  }

  const formData = this.studyForm.getRawValue();

  // Check if uId already exists in filtered studies
  const isUIdUnique = !this.filteredStudies.find((study) => study.uID === formData.uId && study.studyId === formData.studyId);

  if (!isUIdUnique) {
    return of(null); // No need to check studyId if uId is already present
  }

  return this.studyService.checkStudyIdValidator(control.value).pipe(
    debounceTime(500),
    map((response: any) => {
      return response.exists ? { studyIdExists: true } : null;
    }),
    catchError(() => of(null)) // Handle errors gracefully
  );
}

  
  // Custom Validator: At least one required field must be filled
  atLeastOneRequiredValidator(
    studyIdField: string,
    studyNameField: string,
    dynamicFields: string[]
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const studyIdValue = formGroup.get(studyIdField)?.value?.toString().trim();
      const studyNameValue = formGroup.get(studyNameField)?.value?.toString().trim();
  
      const hasStudyId = !!studyIdValue;
      const hasStudyName = !!studyNameValue;
  
      const hasDynamicFieldValue = dynamicFields.some((field) => {
        const controlValue = formGroup.get(field)?.value?.toString().trim();
        return !!controlValue;
      });
  
      console.log(
        'Validator Running - hasStudyId:', hasStudyId,
        'hasStudyName:', hasStudyName,
        'hasDynamicFieldValue:', hasDynamicFieldValue
      );
  
      // If none of the required fields have a value, set the error
      if (!hasStudyId && !hasStudyName && hasDynamicFieldValue) {
        console.log('Validator Setting Error: requiredOne');
        return { requiredOne: true };
      }
  
      console.log('Validator Passed - No Error');
      return null; // Validation passes
    };
  }
  
  
  
  
  
  
  
  
  // Toggle edit mode
  onToggleEditMode() {
   
    if (!this.isEditable) {
      this.studyForm.disable();
    } else {
      this.studyForm.enable();
      
    }
  }

  onSubmit() {
    const studyIdValid = this.studyForm.controls['studyId'].valid;
    const studyNameValid = this.studyForm.controls['studyName'].valid;
    if (studyIdValid || studyNameValid) {
      const formData = this.studyForm.getRawValue(); // Include disabled fields like studyId

      const updatedStudyData = {
        uID: formData.uId,
        studyId: formData.studyId || null,
        studyName: formData.studyName || null, // Capture updated studyName
        fields: Object.keys(formData)
          .filter((key) => key !== 'studyId' && key !== 'studyName' && key !== 'uId') // Exclude non-field keys
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
      this.updateStudy(updatedStudyData)
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
  updateStudy(updatedStudyData: any): void {
    this.studyService.updateStudyData(updatedStudyData.uID, updatedStudyData).subscribe({
      next: () => {
        alert('Study data updated successfully');
  
        // Find and update the study in the local array
        const index = this.studies.findIndex((s) => s.studyId === updatedStudyData.studyId);
        if (index !== -1) {
          this.studies[index] = {
            ...updatedStudyData,
            status: this.computeStudyStatus(updatedStudyData.fields) // Recompute status
          };
        }
  
        // Completely replace the filteredStudies array to trigger UI refresh
        this.filteredStudies = [...this.studies];
  
        // Force UI update
        this.cdr.detectChanges(); 
        this.cdr.markForCheck();
      },
      error: (error) => {
        alert('Error updating study data');
        console.error('Error updating study data:', error);
      }
    });
  }
  
  
  

}
