using CMS.Domain.Enum;

namespace CMS.Domain.Employee
{
    public class EmployeeExperience
    {
        public int Id { get; set; }
        public string FirmName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string JobTitle { get; set; }
        public string City { get; set; }
        public decimal LastSalary { get; set; }
        public string ReasonForResignation { get; set; }
        public ExperienceType ExperienceType { get; set; } = ExperienceType.NewHire;
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public bool IsCurrentExperiance { get; set; }
    }
}
