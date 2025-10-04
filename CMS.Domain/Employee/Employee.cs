


using CMS.Domain.EmployeeDocument;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Jobs;
using CMS.Domain.Language;
using System.ComponentModel.DataAnnotations;


namespace CMS.Domain.Employee
{
    public class Employee : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }
        public int? PreviousEmployeeId { get; set; }
       // public Employee? PreviousEmployee { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string DisplayName { get; set; }

        public string AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public string AmharicDisplayName { get; set; }
        public string? TinNumber { get; set; }
        public string? PensionID { get; set; }
        public EmploymentType? EmploymentType { get; set; }
        public int BusinessUnitID { get; set; }
        public int JobId { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly EmployementDate { get; set; }
        public Gender Gender { get; set; }
        public MartialStatus MartialStatus { get; set; }
        public BusinessUnit BusinessUnits { get; set; }
        public int? SalaryOnGradeStepId { get; set; }//0 for base,10 for Ceiling and step is from grade steps 
        public Job Job { get; set; }
        public bool IsNew { get; set; }
        public EmployeeStatusEnum EmployeeStatus { get; set; }
        public ProbationResult? ProbationResult { get; set; }
        public string? ProbationRemark { get; set; }
        public EmployeeIDCardStatus EmployeeIDCardStatus { get; set; } = EmployeeIDCardStatus.IDNotGiven;
        public EmployeeIDCardReplaceReason? IDReplaceReason { get; set; }
        public ICollection<Domain.Employee.EmployeeDocument> EmployeeDocuments { get; set; }
        public ICollection<Domain.Employee.EmployeeComment> EmployeeComments { get; set; }
        public ICollection<Domain.Education.Education> Educations { get; set; }
        public ICollection<LanguageSkill> LanguageSkills { get; set; }
        public ICollection<EmployeeEmergencyContact> EmployeeEmergencyContacts { get; set; }
        public ICollection<Domain.Employee.EmployeeFamily> EmployeeFamilies { get; set; }
        public ICollection<CMS.Domain.EmployeeDocument.EmployeeFileDocument> EmployeeFileDocuments { get; set; } = new List<EmployeeFileDocument>();
        public string? EmployeeIdCardStatusRemark { get; set; }

        public ICollection<Acting.Acting> Actings { get; set; } = new List<Acting.Acting>();
        public ICollection<Delegations.Delegation> Delegations { get; set; } = new List<Delegations.Delegation>();
        


    }

}
