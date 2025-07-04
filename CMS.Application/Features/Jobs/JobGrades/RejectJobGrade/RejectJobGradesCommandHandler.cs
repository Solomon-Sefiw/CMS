using CMS.Application.Features.Job.JobGrades.Commands.ApproveGrade;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.RejectJobGrade
{
    public class RejectJobGradesCommandHandler : IRequestHandler<RejectJobGradeCommand, int>
    {
        private readonly IDataService dataService;

        public RejectJobGradesCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectJobGradeCommand command, CancellationToken cancellationtoken)
        {
            var jobGrades= dataService.JobGrades.Where(JR=>JR.JobGradeId==command.Id).FirstOrDefault();
            jobGrades.ApprovalStatus = ApprovalStatus.Rejected;
            jobGrades.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return (int)jobGrades.JobGradeId;
        }
    }
}
