using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.ApproveGrade
{
    public class ApproveJobGradeCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string? comment { get; set; }
    }
}
