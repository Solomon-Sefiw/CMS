using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.ActivateJobRole
{
    public class ActivateJobRoleCommandHandler : IRequestHandler<ActivateJobRoleCommand, int>
    {
        private readonly IDataService dataService;
        public ActivateJobRoleCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ActivateJobRoleCommand command, CancellationToken cancellationtoken)
        {
            var JobRoles = dataService.JobRoles.Where(jr => jr.Id == command.Id).FirstOrDefault();
            JobRoles.IsActive = ActivationEnum.Active;
            JobRoles.StatusRemark = command.comment;
            await dataService.SaveAsync(cancellationtoken);
            return JobRoles.Id;
        }
    }
}
