using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Jobs.JobGrades.CreateJobGrade
{
    public class AddJobGradeCommand : IRequest<int>
    {
        public JobGradeRomanId JobGradeRomanId { get; set; }
        public string? Name { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal StepCoefficient { get; set; }
        public decimal? CeilingSalary { get; set; }
        public string? Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }


    }
}
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

