using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.ApproveJobRoleCatagory
{
    public record ApproveJobRoleCatagoryCommand(int Id) : IRequest<int>;

    public class ApproveJobRoleCatagoryCommandHandler : IRequestHandler<ApproveJobRoleCatagoryCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveJobRoleCatagoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveJobRoleCatagoryCommand command, CancellationToken cancellationToken)
        {
            var jobRoleCategory = dataService.JobRoleCatagories.Where(r => r.Id == command.Id).FirstOrDefault();

            jobRoleCategory.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return jobRoleCategory.Id;
        }
    }
}
