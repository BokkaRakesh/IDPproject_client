import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors } from "@angular/forms";
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
  isFieldExpanded: { [key: string]: boolean } = {};  // Track expanded fields
  commentExpanded: { [key: string]: boolean } = {};  // Track expanded comments
  isAllExpanded = false; // Track global expand/collapse state
  @Input() mode: 'new' | 'existing' = 'new';

  statusOptions = [
    { label: 'Not Yet started', value: 'notyetstarted' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Complete', value: 'complete' },
    { label: 'Not Applicable', value: 'notApplicable' },
  ];

  fields = [
    { key: 'requestNewData', label: 'Study team request for new data ingestion', comment: 'notyetstarted', 
      icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ]
    },
    { key: 'onboardingDocs', label: 'New study onboarding information(gform) from the study team', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'jiraCreation', label: 'Jira creation on ICDP dashboard', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'apolloMetaRequest', label: 'Apollo meta request creation and approval', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'idtaCreation', label: 'Image data transfer agreement creation and approval', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 's3Bucket', label: 'AWS S3 bucket creation and testing with the vendor', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'sampleDataTransfer', label: 'Sample data transfer with transfer log', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'sampleDataValidationFlywheel', label: 'Sample data ingestion and validation on GIP', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'sampleDataIngestionConfirmation', label: 'Sample data ingestion confirmation to the vendor', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'fullDatasetTransfer', label: 'Full dataset transfer by the vendor', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'fullDatasetIngestionFlywheel', label: 'Full dataset ingestion on GIP', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'fullDatasetValidationVendor', label: 'Full dataset validation and confirmation to the vendor', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] },
    { key: 'datasetAvailability', label: 'Dataset availability confirmation to the study team', comment: 'notyetstarted', icdp_users: [
        { keyUser: "Alex Dumay", email: "alex.dumay@icdp.com" },
        { keyUser: "Moushami Choudhari", email: "moushami.choudhari@icdp.com" },
        { keyUser: "Abinaya Ramachandran", email: "abinaya.ramachandran@icdp.com" },
        { keyUser: "Manisha Bharambe", email: "manisha.bharambe@icdp.com" },
        { keyUser: "Manjunath Shivamogga", email: "manjunath.shivamogga@icdp.com" },
        { keyUser: "Nishit Kothari", email: "nishit.kothari@icdp.com" },
        { keyUser: "Nitin Pathania", email: "nitin.pathania@icdp.com" },
        { keyUser: "Prasad Admane", email: "prasad.admane@icdp.com" },
        { keyUser: "Priti Prajapati", email: "priti.prajapati@icdp.com" },
        { keyUser: "Reena John", email: "reena.john@icdp.com" },
        { keyUser: "Sandeep Ahuja", email: "sandeep.ahuja@icdp.com" },
        { keyUser: "Sneha Agarkhed", email: "sneha.agarkhed@icdp.com" },
        { keyUser: "Uddhav Ansurkar", email: "uddhav.ansurkar@icdp.com" }
      ] }
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
          acc[`${field.key}_comment`] = [null];
          acc[`${field.key}_icdpUsers`] = [null];
          acc[`${field.key}_toDate`] = [null, Validators.required];
          acc[`${field.key}_fromDate`] = [null, Validators.required];
          return acc;
        }, {}),
      },
      { validators:this.atLeastOneRequiredValidator(['studyId', 'studyName']),
       
       }
    );
    this.initializeStatusIcons();
  }

  dateRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let errors: any = {};
  
      this.fields.forEach(field => {
        const fromDateControl = formGroup.get(`${field.key}_fromDate`);
        const toDateControl = formGroup.get(`${field.key}_toDate`);
  
        if (!fromDateControl || !toDateControl) return;
  
        const fromDate = fromDateControl.value ? new Date(fromDateControl.value) : null;
        const toDate = toDateControl.value ? new Date(toDateControl.value) : null;
  
        // Skip validation if either field is missing (let required validation handle it)
        if (!fromDate || !toDate) return;
  
        if (fromDate > toDate) {
          // Assign custom error without overriding existing required errors
          const fromErrors = fromDateControl.errors || {};
          fromErrors['invalidDateRange'] = true;
          fromDateControl.setErrors(fromErrors);
  
          const toErrors = toDateControl.errors || {};
          toErrors['invalidDateRange'] = true;
          toDateControl.setErrors(toErrors);
  
          // Also add to the form's overall error object
          errors[`${field.key}_invalidDateRange`] = "From Date cannot be later than To Date.";
        } else {
          // Only clear dateRange error if it exists, without removing required errors
          if (fromDateControl.errors?.['invalidDateRange']) {
            const { invalidDateRange, ...otherErrors } = fromDateControl.errors;
            fromDateControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
          }
          if (toDateControl.errors?.['invalidDateRange']) {
            const { invalidDateRange, ...otherErrors } = toDateControl.errors;
            toDateControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
          }
        }
      });
  
      return Object.keys(errors).length > 0 ? errors : null;
    };
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
  console.log("formData",formData);
      // Convert `fields` to match DynamoDB's structure
      const formattedFields = Object.keys(formData)
        .filter((key) => key !== 'studyId' && key !== 'studyName' && key !== 'uId') // Exclude non-field keys
        .filter((key) => !key.endsWith('_comment') && !key.endsWith('_icdpUsers') && !key.endsWith('_fromDate') && !key.endsWith('_toDate')) // Handle comments separately
        .map((key) => ({
          M: {
        key: { S: key }, // Form key (from the form)
        label: { S: this.fields.find((field) => field.key === key)?.label || '' },
        comment: { S: formData[key + '_comment'] || '' }, // Get updated comment from form
        status: { S: formData[key] }, // Get updated status value from form
        fromDate: { S: formData[key + '_fromDate'] },
        toDate: { S: formData[key + '_toDate'] },
        icdp_users: { S: formData[key + '_icdpUsers'] },
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
  
      console.log('adding Study Data:', updatedStudyData);
  
      // Submit the updated data to the service
      this.studyService.saveStudyData(updatedStudyData).subscribe({
        next: () => {
          alert('Study data added successfully');
          this.studyForm.reset();
        },
        error: (error) => {
          alert('Error in adding study data');
          console.error('Error in adding study data:', error);
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

  toggleExpand(key: string): void {
    this.isFieldExpanded[key] = !this.isFieldExpanded[key];
    this.commentExpanded[key] = false;
  }

  toggleComment(key: string): void {
    this.commentExpanded[key] = !this.commentExpanded[key];
  }
  toggleAllFields(): void {
    this.isAllExpanded = !this.isAllExpanded;
    for (const field of this.fields) {
      this.isFieldExpanded[field.key] = this.isAllExpanded;
      this.commentExpanded[field.key] = true;
    }
  }


}
