using CMS.Domain.Enum;
using MediatR;
using System;

namespace CMS.Application.Features.Jobs.JobGrades.UpdateJobGrade
{
    public class UpdateJobGradeCommand:IRequest<int>
    {
        public int JobGradeId { get; set; }
        public JobGradeRomanId JobGradeRomanId { get; set; }
        public string Name { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal StepCoefficient { get; set; }
        public decimal? CeilingSalary { get; set; }
        public string Description { get; set; }
        public string? StatusRemark { get; set; }
    }
}
