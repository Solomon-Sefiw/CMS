using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.ApproveJobRole
{
    public class ApproveJobRolesCommandHandler:IRequestHandler<ApproveJobRolesCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveJobRolesCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveJobRolesCommand command, CancellationToken cancellationtoken)
        {
            var jobRoles= dataService.JobRoles.Where(JR=>JR.Id==command.Id).FirstOrDefault();
            jobRoles.ApprovalStatus = ApprovalStatus.Approved;
            jobRoles.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return jobRoles.Id;
        }
    }
}
