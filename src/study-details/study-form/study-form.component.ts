import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { StudyService } from "../services/study.service";
import { Observable, of } from "rxjs";
import { map, catchError, debounceTime } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { StudyField, StudyFields } from "../interfaces/studyFile.interface";

@Component({
  selector: 'app-study-form',
  standalone: true,
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule],
})
export class StudyFormComponent implements OnInit {
  studyForm!: FormGroup;
  statusIcons: { [key: string]: string } = {};
  @Input() mode: 'new' | 'existing' = 'new';

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

  constructor(private fb: FormBuilder, private studyService: StudyService) {}

  ngOnInit() {
    this.studyForm = this.fb.group(
      {
        studyId: [
          '',
          [Validators.required],
          [this.checkStudyIdValidator.bind(this)], // Async Validator
        ],
        studyName: ['', Validators.required],
        ...this.fields.reduce((acc: { [key: string]: any }, field) => {
          acc[field.key] = ['notyetstarted', Validators.required];
          acc[`${field.key}_comment`] = [''];
          return acc;
        }, {}),
      },
      { validators: this.atLeastOneRequiredValidator(['studyId', 'studyName']) }
    );
    this.initializeStatusIcons();
  }
    // Async Validator for checking `studyId`
    checkStudyIdValidator(control: AbstractControl) {
      if (!control.value) {
        return of(null); // No error if the control is empty
      }
      //this.http.get(`/api/check-study-id/${control.value}`)
  
      return this.studyService.checkStudyIdValidator(this.studyForm.get('studyId')?.value).pipe(
        debounceTime(500),
        map((response: any) => {
          return response.exists ? { studyIdExists: true } : null;
        }),
        catchError(() => of(null)) // Handle errors gracefully
      );
    }
  
  initializeStatusIcons() {
    this.fields.forEach((field) => {
      const status = this.studyForm.get(field.key)?.value || 'notyetstarted';
      this.statusIcons[field.key] = this.getStatusIcon(status);
    });
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'notyetstarted': return 'bi bi-exclamation-circle text-warning';
      case 'inProgress': return 'bi bi-arrow-repeat text-primary';
      case 'complete': return 'bi bi-check-circle text-success';
      case 'notApplicable': return 'bi bi-ban text-danger';
      default: return '';
    }
  }
  initializeForm(): void {
    this.studyForm = this.fb.group({
      studyId: ['', Validators.required],
      studyName: ['', Validators.required],
      ...this.fields.reduce((acc: { [key: string]: any }, field) => {
        acc[field.key] = ['notyetstarted', Validators.required];
        acc[field.key + '_comment'] = [''];
        return acc;
      }, {}),
    });
  }


  atLeastOneRequiredValidator(fields: string[]) {
    return (formGroup: FormGroup): { [key: string]: boolean } | null => {
      const hasOne = fields.some((field) => !!formGroup.get(field)?.value?.trim());
      return hasOne ? null : { requiredOne: true };
    };
  }

  setInitialIcons(): void {
    this.fields.forEach((field) => {
      const status = this.studyForm.get(field.key)?.value || 'notyetstarted';
      this.setStatusIcon(field.key, status);
    });
  }

  setStatusIcon(fieldKey: string, status: string): void {
    switch (status) {
      case 'notyetstarted':
        this.statusIcons[fieldKey] = 'bi bi-exclamation-circle text-warning';
        break;
      case 'inProgress':
        this.statusIcons[fieldKey] = 'bi bi-arrow-repeat text-primary';
        break;
      case 'complete':
        this.statusIcons[fieldKey] = 'bi bi-check-circle text-success';
        break;
      case 'notApplicable':
        this.statusIcons[fieldKey] = 'bi bi-ban text-danger';
        break;
      default:
        this.statusIcons[fieldKey] = '';
    }
  }

  onStatusChange(fieldKey: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;
    this.setStatusIcon(fieldKey, status);
  }
  
  onSubmit() {
    const studyIdValid = this.studyForm.controls['studyId'].valid;
    const studyNameValid = this.studyForm.controls['studyName'].valid;
    
    if (studyIdValid || studyNameValid) {
      const formData = this.studyForm.getRawValue(); // Include disabled fields like studyId
  
      // Convert `fields` to match DynamoDB's structure
      const formattedFields = Object.keys(formData)
        .filter((key) => key !== 'studyId' && key !== 'studyName' && key !== 'uId') // Exclude non-field keys
        .filter((key) => !key.endsWith('_comment')) // Handle comments separately
        .map((key) => ({
          M: {
            key: { S: key }, // Form key (from the form)
            label: { S: this.fields.find((field) => field.key === key)?.label || '' },
            status: { S: formData[key] }, // Get updated status value from form
            comment: { S: formData[key + '_comment'] || '' }, // Get updated comment from form
          },
        }));
  
      // Final payload format matching the JSON structure
      const updatedStudyData = {
        studyId: { S: formData.studyId },
        studyName: { S: formData.studyName },
        fields: { L: formattedFields },
        createdAt: { S: new Date().toISOString() }, // Capture creation timestamp
        updatedAt: { S: new Date().toISOString() }, // Capture update timestamp
      };
  
      console.log('Updated Study Data:', updatedStudyData);
  
      // Submit the updated data to the service
      this.studyService.saveStudyData(updatedStudyData).subscribe({
        next: () => {
          alert('Study data updated successfully');
          this.studyForm.reset();
        },
        error: (error) => {
          alert('Error updating study data');
          console.error('Error updating study data:', error);
        },
      });
    }
  }
  
  
  
  
  // Helper function to convert enum keys to camelCase to match form field keys
  private toCamelCase(enumKey: string): string {
    return enumKey.charAt(0).toLowerCase() + enumKey.slice(1);
  }

  isSubmitDisabled(): boolean {
    // Disable the button if both fields are invalid
    const studyIdValid = this.studyForm.controls['studyId'].valid;
    const studyNameValid = this.studyForm.controls['studyName'].valid;

    // Button is enabled if either one is valid
    return !(studyIdValid || studyNameValid);
  }
}
