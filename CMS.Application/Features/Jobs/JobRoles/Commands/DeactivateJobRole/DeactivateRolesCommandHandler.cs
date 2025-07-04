using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.DeactivateJobRole
{
    public class DeactivateJobRoleCommandHandler:IRequestHandler<DeactivateJobRoleCommand, int>
    {
        private readonly IDataService dataService;

        public DeactivateJobRoleCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(DeactivateJobRoleCommand command, CancellationToken cancellationtoken)
        {
            var JobRoles= dataService.JobRoles.Where(bu=>bu.Id==command.Id).FirstOrDefault();
            JobRoles.IsActive = ActivationEnum.InActive;
            JobRoles.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return JobRoles.Id;
        }
    }
}
