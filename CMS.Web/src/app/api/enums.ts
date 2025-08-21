export enum Gender {
  Male = 1,
  Female = 2,
  Unspecified = 0, // Default/empty value
}
export enum WarningStatus {
  FirstLevel = 1,
  SecondLevel = 2,
  ThirdLevel = 3
}
export enum ViolationType {
  Attendance = 1,
  Behavior = 2,
  Performance = 3,
  Other = 4
}
export enum LetterType {
  Incoming = 1,
  Outgoing,
  InternalMemo
}
export enum MartialStatus {
  Single = 1,
  Married = 2,
  Divorced = 3,
  Widowed = 4,
}
export enum ExperienceType {
  External = 1,
  NewHire = 2,
  Delegation = 3,
  Acting = 4,
  Promotion = 5,
  Demotion = 6,
  Transfer = 7,
}
export enum ClaimCategory {
  User = 1,
  Setup = 2,
  EmployeePersonalInfo = 3,
  EmployeeProbation = 4,
  AddressAndContact = 5,
  EmployeeId = 6,
  Dashboard = 7,
  Letter = 8,
   EmployeeActivity = 9,
}
export enum ResignationType {
  Voluntary = 1,
  Dismissal = 2,
  Retirement = 3,
  Decease = 4
}
export enum SuspensionReason {
  Investigation = 1,
  PolicyViolation = 2,
  Misconduct = 3,
  PerformanceIssues = 4,
  Other = 99
}
export enum ApprovalStatus {
  Draft = 1,
  Submitted = 2,
  Rejected = 3,
  Approved = 4,
}
export enum LetterStatus {
  pending = 1,
  received,
  responded,
  archived
}
export enum EmployeeStatusEnum {
  Active = 1,
  Inactive = 2,
  Blocked = 3,
  New = 4,
  Exisitng = 5,
  Resigned = 7,
  Terminated = 8,
  ReAssigned = 9,
  UnderProbation = 6,
  ProbationApprovalRequest = 11,
  ProbationApprovalRejected = 10,
}
export enum EmployeeIDCardStatus {
  IDCardApprovalRequest = 1,
  IDCardApprovalRejected = 2,
  IDGiven = 3,
  IDReplacedAndGiven = 4,
  IDNotGiven = 5,
  IDCardOnRegenerated = 6,
  IDCardApproved = 7,
}
export enum EmployeeIDCardReplaceReason {
  lost = 1,
  damaged = 2,
  falseInformation = 3,
  ReEmployeedID = 4,
  other = 5,
}
export enum ProbationResult {
  BecomePermanent = 1,
  PoorPerformance = 2,
  PolicyViolation = 3,
  AttendanceIssues = 4,
  BehavioralIssues = 5,
  NotaCulturalFit = 6,
  Other = 7,
  ReturnedFromApproval = 8,
  ActivateRejectedProbation = 9,
}
export enum PromotionType {
  Promotion = 1,
  Other = 2,
}
export enum ReClassificationType {
  JobRoleChange = 1,
  Other = 2
}
export enum DemotionType {
  PoorPerformance = 1,
  DisciplinaryAction = 2,
  Restructuring = 3,
  VoluntaryRequest = 4,
  LackofRequiredSkills = 5,
  Other = 6
}
export enum EmployeeTransactionStatus {
  Draft = 1,
  Submitted = 2,
  Rejected = 3,
  Approved = 4
}
export enum JobCatagoryEnum {
  Clerical = 1,
  Non_Clerical = 2,
  Professional = 3,
  Managerial = 4,
}
export enum AddressType {
  BusinessUnitAddress = 1,
  BirthPlaceAddress = 2,
  CurrentAddress = 3,
  EmergencyContactAddress = 4,
  SpouseAddress = 5,
  EmployeeGuaranterAddress = 6,
  WorkingFirmAddress = 7,
  ParentAddress = 8,
  GuaranterWorkingFirmAddress = 9,
}
export enum Country {
  Ethiopia = 1,
}
export enum ActingType {
  Permanent = 1,
  Temporary = 2,
  Reassignment = 3,
}

export enum ContactType {
  Email = 1,
  CellPhone = 2,
  HomePhone = 3,
  WorkPhone = 4,
  Fax = 5,
  PoBox = 6,
}
export enum ContactCategory {
  BusinessUnitContact = 1,
  EmployeeContact = 2,
  EmergencyContact = 3,
  EmployeeSpouseContact = 6, //previous 2
  EmployeeParentContact = 7, //previous 3
  EmployeeGuaranter = 4,
  GuaranterWorkingFirmContact = 5,
}
export enum Status {
  Active = 1,
  Closed = 2,
}

export enum EmployeeChangeLogEntityType {
  BasicInfo = 1,
  Family = 2,
  Address = 3,
  Contact = 4,
  EmergencyContact = 5,
  Block = 6,
  Unblock = 7,
  Language = 8,
  Education = 9,
  Experiance = 10,
  Guarantee = 11,
}

export enum ChangeType {
  Added = 1,
  Modified = 2,
  Deleted = 3,
  Blocked = 4,
  Unblocked = 5,
}

export enum Activation {
  Active = 1,
  InActive = 0,
}
export enum EducationLevel {
  Primary = 1,
  MiddleSchool = 2,
  HighSchool = 3,
  Vocational = 4,
  Associate = 5,
  Bachelor = 6,
  PostgraduateDiploma = 7,
  Master = 8,
  Doctorate = 9,
  PostDoctorate = 10,
  Professional = 11,
  Certificate = 12,
  Diploma = 13,
  Other = 14,
}
export enum FamilyType {
  EmployeeParent = 1,
  EmployeeSpouse = 2,
  EmployeeChild = 3,
}
export enum ContactEntityType {
  EmployeeContact = 1,
  BussinessUnitContact = 2,
  EmployeeSpouseContact = 3,
  EmployeeParentContact = 4,
  EmployeeGuaranter = 5,
  EmployeeGuaranterWorkingFirm = 6,
}
export enum IsParentLiving {
  Unspecified = 0, // Default/empty value
  Yes = 1,
  No = 2,
}
export enum SpouseIsWorking {
  Unspecified = 0, // Default/empty value
  Yes = 1,
  No = 2,
}
export enum ParentType {
  Father = 1,
  Mother = 2,
  Unspecified = 0, // Default/empty value
}
export enum EducationLabel {
  Primary = 1,
  MiddleSchool = 2,
  HighSchool = 3,
  Vocational = 4,
  Associate = 5,
  Bachelor = 6,
  PostgraduateDiploma = 7,
  Master = 8,
  Doctorate = 9,
  PostDoctorate = 10,
  Professional = 11,
  Certificate = 12,
  Diploma = 13,
  Other = 14,
}
export enum Language {
  Amharic = 1, // Official working language of the federal government
  Oromo, // Widely spoken in Ethiopia
  Tigrinya, // Spoken in Tigray Region and Eritrea
  Somali, // Spoken in Somali Region
  Afar, // Spoken in Afar Region
  Sidamo, // Spoken in Southern Ethiopia
  Wolaytta, // Spoken in Southern Nations, Nationalities, and Peoples' Region (SNNPR)
  Gurage, // Spoken by the Gurage ethnic group
  Hadiya, // Spoken in the SNNPR
  Gamo, // Spoken in Southern Ethiopia
  Gedeo, // Spoken in the SNNPR
  Kafa, // Spoken in the SNNPR
  Agew, // Spoken in Amhara and Benishangul-Gumuz Regions
  Harari, // Spoken in Harari Region
  Anuak, // Spoken in Gambela Region
  Nuer, // Spoken in Gambela Region
  Bench, // Spoken in Southern Ethiopia
  Shinasha, // Spoken in Benishangul-Gumuz Region
  Dawro, // Spoken in Southern Ethiopia
  Silt, // Spoken in the Silt'e Zone
  Zay, // Spoken by the Zay people
  Konso, // Spoken in Southern Ethiopia
  Berta, // Spoken in Benishangul-Gumuz Region
  Gumuz, // Spoken in Benishangul-Gumuz Region
  Majang, // Spoken in Gambela Region
  Nyangatom, // Spoken in Southern Ethiopia
  Dasanech, // Spoken in Southern Ethiopia
  Me_en, // Spoken in Gambela Region
  Anyuak,
  English,
  Spanish,
  French,
  German,
  Italian,
  Portuguese,
  Russian,
  Chinese,
  Japanese,
  Korean,
  Hindi,
  Arabic,
  Bengali,
  Urdu,
  Turkish,
  Persian,
  Dutch,
  Swedish,
  Norwegian,
  Danish,
  Finnish,
  Greek,
  Polish,
  Czech,
  Hungarian,
  Romanian,
  Thai,
  Vietnamese,
  Malay,
  Indonesian,
  Filipino,
  Swahili,
  Zulu,
  Hebrew,
  Tamil,
  Telugu,
  Kannada,
  Gujarati,
  Marathi,
  Punjabi,
  Sinhala,
  Burmese,
  Lao,
  Khmer,
}
export enum LanguageSkillLevel {
  Beginner = 1,
  Intermediate,
  Advanced,
  Native,
}

export enum Permission {

  canViewEmployeeId = "canViewEmployeeId",
  canCreateUpdateEmployeeId = "canCreateUpdateEmployeeId",
  canApproveRejectEmployeeId = "canApproveRejectEmployeeId",
  canSubmitEmployeeId = "canSubmitEmployeeId",
  canGiveEmployeeId = "canGiveEmployeeId",
  canReplaceEmployeeId = "canReplaceEmployeeId",
  //EmployeeProbation
  canViewEmployeeProbation = "canViewEmployeeProbation",
  canApproveRejectEmployeeProbation = "canApproveRejectEmployeeProbation",
  canSubmitEmployeeProbation = "canSubmitEmployeeProbation",
  canTerminateEmployeeProbation = "canTerminateEmployeeProbation",
  canActivateDeactivateEmployeeProbation = "canActivateDeactivateEmployeeProbation",
  // Employee Personal Info
  canApproveRejectEmployeePersonalInfo = "canApproveRejectEmployeePersonalInfo",
  canCreateUpdateEmployeePersonalInfo = "canCreateUpdateEmployeePersonalInfo",
  canViewEmployeePersonalInfo = "canViewEmployeePersonalInfo",
  canSubmitEmployeePersonalInfo = "canSubmitEmployeePersonalInfo",
  canActivateEmployeePersonalInfo = "canActivateEmployeePersonalInfo",
  canDeactivateEmployeePersonalInfo = "canDeactivateEmployeePersonalInfo",

  //AddressContact 
  canViewAddressAndContact = "canViewAddressAndContact",
  canCreateUpdateAddressAndContact = "canCreateUpdateAddressAndContact",
  canActivateAddressAndContact = "canActivateAddressAndContact",
  canDeactivateAddressAndContact = "canDeactivateAddressAndContact",
  //User
  canCreateUpdateUser = "canCreateUpdateUser",
  canEnableUser = "canEnableUser",
  canDisableUser = "canDisableUser",
  canViewUser = "canViewUser",
  // Setup
  canViewSetup = "canViewSetup",
  canCreateUpdateSetup = "canCreateUpdateSetup",
  canApproveRejectSetup = "canApproveRejectSetup",
  canSubmitSetup = "canSubmitSetup",
  canDeactivateSetup = "canDeactivateSetup",
  canActivateSetup = "canActivateSetup",
  // Dashboard
  // Cards
  canViewAllActiveEmployees = "canViewAllActiveEmployees",
  canViewAllVacantJobs = "canViewAllVacantJobs",
  canViewAllResignedEmployees = "canViewAllResignedEmployees",
  canViewAllBusinessUnits = "canViewAllBusinessUnits",
  canViewAllNewEmployees = "canViewAllNewEmployees",
  canViewAllPositions = "canViewAllPositions",
  canViewTurnoverRates = "canViewTurnoverRates",
  canViewRetentionRates = "canViewRetentionRates",
  //Chart And Graph
  canViewEmployeeDistributionByStatusDoughnutChart = "canViewEmployeeDistributionByStatusDoughnutChart",
  canViewMonthlyNewEmployeesOfFiscalYearBarChart = "canViewMonthlyNewEmployeesOfFiscalYearBarChart",
  canViewEmployeeDistributionByJobCategoryPieChart = "canViewEmployeeDistributionByJobCategoryPieChart",
  canViewMonthlyHRMetricsLineGraph = "canViewMonthlyHRMetricsLineGraph",

  //Approval
  canViewAllApprovalSummaries = "canViewAllApprovalSummaries",
  canViewAllApprovalRequestGrid = "canViewAllApprovalRequestGrid",
  // Dashboard
  canViewLetterCountBoard = "canViewLetterCountBoard",
  canViewRecentLettersBoard = "canViewRecentLettersBoard",
  // letter 
  canViewLetter = "canViewLetter",
  canCreateUpdateLetter = "canCreateUpdateLetter",
  canApproveRejectLetter = "canApproveRejectLetter",
  canSubmitLetter = "canSubmitLetter",
  canActivateLetter = "canActivateLetter",
  canDeactivateLetter = "canDeactivateLetter",
  //Employee Activity
  canViewEmployeeActivity = "canViewEmployeeActivity",
  canCreateUpdateEmployeeActivity = "canCreateUpdateEmployeeActivity",
  canApproveRejectEmployeeActivity = "canApproveRejectEmployeeActivity",
  canSubmitEmployeeActivity = "canSubmitEmployeeActivity",
  canActivateEmployeeActivity = "canActivateEmployeeActivity",
  canDeactivateEmployeeActivity = "canDeactivateEmployeeActivity",
}
export enum Guarantee {
  InWard = 1,
  OutWard = 2,
}
export enum JobGradeRomanId {
  I = 1,
  II = 2,
  III = 3,
  IV = 4,
  V = 5,
  VI = 6,
  VII = 7,
  VIII = 8,
  IX = 9,
  X = 10,
  XI = 11,
  XII = 12,
  XIII = 13,
  XIV = 14,
  XV = 15,
  XVI = 16,
  XVII = 17,
  XVIII = 18,
  XIX = 19,
  XX = 20,
  XXI = 21,
  XXII = 22,
  XXIII = 23,
  XXIV = 24,
  XXV = 25,
  XXVI = 26,
  XXVII = 27,
  XXVIII = 28,
  XXIX = 29,
  XXX = 30,
  XXXI = 31,
  XXXII = 32,
  XXXIII = 33,
  XXXIV = 34,
  XXXV = 35,
  XXXVI = 36,
  XXXVII = 37,
  XXXVIII = 38,
  XXXIX = 39,
  XL = 40,
}

export enum DocumentType {
  Other = 0,
  UserPhoto = 1,
  UserSignature = 2,
  LetterDocument = 3,
  DepartmentBluePrint = 4,
  EmployeePicture = 5,
  BirthCertificate = 6,
  EmployeeSignature = 8,
  EducationalDocument = 9,
  ExperienceDocument = 10,
  Certificate = 11,
  OperationalAgreement = 12,
  PhotoIdentification = 13,
  DrivingLicense = 14,
  Passport = 15,
  MarriageCertificate = 16,
  Suspension = 17,
  Resignation = 18,
}
export enum ReemploymentType {
  Reinstate = 1,
  Rehire = 2,
}

// Human-readable labels
export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.Other]: "Other",
  [DocumentType.UserPhoto]: "UserPhoto",
  [DocumentType.UserSignature]: "UserSignature",
  [DocumentType.LetterDocument]: "LetterDocument",
  [DocumentType.DepartmentBluePrint]: "DepartmentBluePrint",
  [DocumentType.EmployeePicture]: "Employee Picture",
  [DocumentType.EmployeeSignature]: "Employee Signature",
  [DocumentType.EducationalDocument]: "Educational Document",
  [DocumentType.ExperienceDocument]: "Experience Document",
  [DocumentType.Certificate]: "Certificate",
  [DocumentType.OperationalAgreement]: "Operational Agreement",
  [DocumentType.PhotoIdentification]: "Photo Identification",
  [DocumentType.DrivingLicense]: "Driving License",
  [DocumentType.Passport]: "Passport",
  [DocumentType.BirthCertificate]: "Birth Certificate",
  [DocumentType.MarriageCertificate]: "Marriage Certificate",
  [DocumentType.Suspension]: "Suspension",
  [DocumentType.Resignation]: "Resignation",
};

export enum EmploymentType {
  Permanent = 1,
  Contract = 2,

};
