using CMS.Application.Features.Jobs.JobRoles.Commands.SubmitJobRoles;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.SubmitJobRoles
{
    public class SubmitJobRolesCommandHandler : IRequestHandler<SubmitJobRolesCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitJobRolesCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitJobRolesCommand command, CancellationToken cancellationtoken)
        {
            var JobRoles= dataService.JobRoles.Where(JR=>JR.Id==command.Id).FirstOrDefault();
            JobRoles.ApprovalStatus = ApprovalStatus.Submitted;
            JobRoles.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return JobRoles.Id;
        }
    }
}
