// CMS.Application/Features/Educations/Queries/GetEducationById/EducationDto.cs
using System;

namespace CMS.Application.Features.Educations.Queries.GetEducationById
{
    public class EducationDto
    {
        public int Id { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string SchoolCity { get; set; }
        public int InstitutionNameId { get; set; }
        public string InstitutionName { get; set; }
        public int EducationLevelId { get; set; }
        public string EducationLevelName { get; set; }
        public int AwardId { get; set; }
        public string AwardName { get; set; }
        public int FieldOfStudyId { get; set; } // Include FieldOfStudyId
        public string FieldOfStudyName { get; set; } // Include FieldOfStudy Name
        public int EmployeeId { get; set; }
        public Decimal? CGPA {  get; set; }
    }
}