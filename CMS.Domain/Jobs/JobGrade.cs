using CMS.Domain.Enum;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain
{
    public class JobGrade
    {
        [Key]
        public int JobGradeId { get; set; }
        public JobGradeRomanId JobGradeRomanId { get; set; }
        public string Name { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal StepCoefficient { get; set; }
        public decimal? CeilingSalary { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public string? StatusRemark { get; set; }

        // Navigation property for related steps
        public List<JobGradeStep> Steps { get; set; } = new();
    }
}
