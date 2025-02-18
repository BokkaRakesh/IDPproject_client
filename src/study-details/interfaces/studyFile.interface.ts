
export interface Study {
  studyId: string;
  fields: StudyField[];
  createdAt: string;
  updatedAt: string;
  stydyName:string
}

export interface DropdownOption {
  label: string;
  value: string;
}
export interface StudyField {
  key: string;
  label: string;
  status?: string;
  comment?: string;
}

export enum StudyFields {
  RequestNewData = 'Study team request for new data ingestion',
  OnboardingDocs = 'New study onboarding information(gform) from the study team',
  JiraCreation = 'Jira creation on ICDP dashboard',
  ApolloMetaRequest = 'Apollo meta request creation and approval',
  IdtaCreation = 'Image data tranfer agreement creation and approval',
  S3Bucket = 'AWS S3 bucket creation and testing with the vendor',
  SampleDataTransfer = 'Sample data transfer with transfer log',
  SampleDataValidationFlywheel = 'Sample data ingestion and validation on GIP',
  SampleDataIngestionConfirmation = 'Sample data ingestion confirmation to the vendor',
  FullDatasetTransfer = 'Full dataset transfer by the vendor',
  FullDatasetIngestionFlywheel = 'Full dataset ingestion on GIP',
  FullDatasetValidationVendor = 'Full dataset validation and confirmation to the vendor',
  DatasetAvailability = 'Dataset availability confirmation to the study team',
}
