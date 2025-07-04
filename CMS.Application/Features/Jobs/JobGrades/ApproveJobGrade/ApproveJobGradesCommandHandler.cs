using CMS.Application.Features.Job.JobGrades.Commands.ApproveGrade;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobGrades.Commands.ApproveJobGrades
{
    public class ApproveJobGradesCommandHandler : IRequestHandler<ApproveJobGradeCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveJobGradesCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveJobGradeCommand command, CancellationToken cancellationtoken)
        {
            var jobGrades= dataService.JobGrades.Where(JR=>JR.JobGradeId==command.Id).FirstOrDefault();
            jobGrades.ApprovalStatus = ApprovalStatus.Approved;
            jobGrades.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return (int)jobGrades.JobGradeId;
        }
    }
}
