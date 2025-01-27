
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
    RequestNewData = 'Request for new data Ingestion',
    JiraCreation = 'Jira creation in ICDP Dashboard',
    ApolloMetaRequest = 'Apollo Meta request creation and approval',
    IdtaCreation = 'IDTA creation and approval',
    S3Bucket = 'S3 bucket creation and testing with the vendor',
    SampleDataTransfer = 'Sample data transfer with transfer log',
    SampleDataVerificationS3 = 'Sample data verification on S3',
    SampleDataValidationFlywheel = 'Sample data validation on Flywheel',
    SampleDataIngestionConfirmation = 'Sample data ingestion confirmation to the vendor',
    GearsCurationTags = 'Gears+Curation+Tags Verification',
    FullDatasetTransfer = 'Full dataset transfer by the vendor',
    FullDatasetVerificationS3 = 'Full dataset verification on S3',
    FullDatasetIngestionFlywheel = 'Full dataset ingestion on Flywheel',
    FullDatasetValidationVendor = 'Full dataset validation confirmation to the vendor',
    OnboardingDocs = 'Onboarding documentation',
    DataIngestionChecklist = 'Data Ingestion Checklist',
    CloseLoopVendor = 'Close the loop with the vendor',
    DatasetAvailability = 'Dataset availability confirmation to the study teams',
    DataAccessRequests = 'Data access requests by the users',
    DataAccessJiraCreation = 'Data access jira creation in ICDP',
    DataAccessCompletion = 'Data access completion by the data managers',
  }
  