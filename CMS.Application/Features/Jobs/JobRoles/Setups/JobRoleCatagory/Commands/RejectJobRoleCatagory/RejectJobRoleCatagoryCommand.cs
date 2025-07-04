using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.RejectJobRoleCatagory
{
    public record RejectJobRoleCatagoryCommand(int Id) : IRequest<int>;

    public class RejectJobRoleCatagoryCommandHandler : IRequestHandler<RejectJobRoleCatagoryCommand, int>
    {
        private readonly IDataService dataService;

        public RejectJobRoleCatagoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectJobRoleCatagoryCommand command, CancellationToken cancellationToken)
        {
            var jobRoleCategory = dataService.JobRoleCatagories.Where(r => r.Id == command.Id).FirstOrDefault();

            jobRoleCategory.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return jobRoleCategory.Id;
        }
    }
}
