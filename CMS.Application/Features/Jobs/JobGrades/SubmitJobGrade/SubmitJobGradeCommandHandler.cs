using CMS.Application.Features.Job.JobGrades.Commands.ApproveGrade;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.SubmitJobGrade
{
    public class SubmitJobGradeCommandHandler : IRequestHandler<SubmitJobGradeCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitJobGradeCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitJobGradeCommand command, CancellationToken cancellationtoken)
        {
            var jobGrades= dataService.JobGrades.Where(JR=>JR.JobGradeId==command.Id).FirstOrDefault();
            jobGrades.ApprovalStatus = ApprovalStatus.Submitted;
            jobGrades.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return (int)jobGrades.JobGradeId;
        }
    }
}
