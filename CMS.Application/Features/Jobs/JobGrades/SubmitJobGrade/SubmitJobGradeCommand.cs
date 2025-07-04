using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.SubmitJobGrade
{
    public class SubmitJobGradeCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
