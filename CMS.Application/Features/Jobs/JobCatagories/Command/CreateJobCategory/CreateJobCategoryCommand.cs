using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.CreateJobCatagory
{
    public record CreateJobCategoryCommand:IRequest<int>
    {
        public int Id { get; set; }
        public string JobCategoryName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ProbationPeriodInDays { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        
    }
}
