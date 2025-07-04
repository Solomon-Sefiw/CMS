using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.RejectJobGrade
{
    public class RejectJobGradeCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
