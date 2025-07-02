export enum Gender {
  Male = 1,
  Female = 2,
  Unspecified = 0, // Default/empty value
}
    export enum LetterType
    {
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
export enum ClaimCategory {
  User = 1,
  Setup,
  AddressAndContact,
  Dashboard
}

export enum ApprovalStatus {
  Draft = 1,
  Submitted = 2,
  Rejected = 3,
  Approved = 4,
}
    export enum LetterStatus
    {
         pending = 1 ,
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
export enum JobCatagoryEnum {
  Clerical = 1,
  Non_Clerical = 2,
  Professional = 3,
  Managerial = 4,
}
export enum AddressType {
        BusinessUnitAddress = 1,
        BirthPlaceAddress = 2,
}
export enum Country {
  Ethiopia = 1,
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
  canViewLetterCountBoard = "canViewLetterCountBoard",
  canViewRecentLettersBoard = "canViewRecentLettersBoard",

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
  UserSignature = 1,
  DepartmentBluePrint = 2,
  LetterDocument = 3,
}
