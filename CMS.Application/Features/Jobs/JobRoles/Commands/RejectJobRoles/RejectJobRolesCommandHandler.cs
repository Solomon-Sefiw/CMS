using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.RejectJobRoles
{
    public class RejectJobRolesCommandHandler : IRequestHandler<RejectJobRolesCommand, int>
    {
        private readonly IDataService dataService;
        public RejectJobRolesCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectJobRolesCommand command, CancellationToken cancellationtoken)
        {
            var JobRoles= dataService.JobRoles.Where(bu=>bu.Id==command.Id).FirstOrDefault();
            JobRoles.ApprovalStatus = ApprovalStatus.Rejected;
            JobRoles.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return JobRoles.Id;
        }
    }
}
