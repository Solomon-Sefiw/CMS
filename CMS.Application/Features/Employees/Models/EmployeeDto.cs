

using CMS.Application.Models;
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Jobs;

namespace CMS.Application.Features
{
    public class EmployeeDto:WorkflowEnabledEntityDto
    {

        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        
        public string AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public string? AmharicDisplayName { get; set; }
        public int BusinessUnitID { get; set; }
        public string BusinessUnit { get; set; }
        public string JobTitle { get; set; }
        public int JobId { get; set; }
        public string? PhotoId { get; set; }
        public string? PhotoUrl { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly EmployementDate { get; set; }
        public Gender Gender { get; set; }
        public MartialStatus MartialStatus { get; set; }
        public bool IsCurrent { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public ICollection<Domain.Employee.EmployeeDocument> EmployeeDocuments { get; set; }
        public BusinessUnit BusinessUnits { get; set; }
        public Domain.Jobs.Job Job { get; set; }
        public bool IsNew { get; set; }
        public Address Address { get; set; }
        public Domain.Contacts.Contact Contact { get; set; }
        public EmployeeStatusEnum EmployeeStatus {  get; set; }
        public ProbationResult? ProbationResult { get; set; }
        public string? ProbationRemark { get; set; }
        public EmployeeIDCardStatus EmployeeIDCardStatus { get; set; } 
        public EmployeeIDCardReplaceReason? IdReplaceReason { get; set; }
        public string ? EmployeeIdCardStatusRemark { get; set; }

        public bool HasAddressInfo { get; set; }
        public bool HasContactInfo { get; set; }
        public bool HasEmployeeFamilyInfo { get; set; }
        public bool HasEmergencyContactInfo { get; set; }
        public bool HasLanguageSkillInfo { get; set; }
    }
}
