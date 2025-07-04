using CMS.Domain.Education.awards;
using CMS.Domain.Employee;
using System;

namespace CMS.Domain.Education
{
    public class Education
    {
        public int Id { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string SchoolCity { get; set; }

        // One-to-One with InstitutionName
        public int InstitutionNameId { get; set; }
        public InstitutionName InstitutionName { get; set; }

        // One-to-One with EducationLevel
        public int EducationLevelId { get; set; }
        public EducationLevel EducationLevel { get; set; }

        // One-to-One with Award
        public int AwardId { get; set; }
        public Award Award { get; set; }

        // One-to-One with FieldOfStudy
        public int FieldOfStudyId { get; set; }
        public FieldOfStudy FieldOfStudy { get; set; }

        // Foreign Key for Employee
        public int? EmployeeId { get; set; }
        public Domain.Employee.Employee? Employee { get; set; }
    }
}