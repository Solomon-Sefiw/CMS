using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.SubmitJobRoleCatagory
{
    public record SubmitJobRoleCatagoryCommand(int Id) : IRequest<int>;

    public class SubmitJobRoleCatagoryCommandHandler : IRequestHandler<SubmitJobRoleCatagoryCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitJobRoleCatagoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitJobRoleCatagoryCommand command, CancellationToken cancellationToken)
        {
            var jobRoleCategory = dataService.JobRoleCatagories.Where(r => r.Id == command.Id).FirstOrDefault();

            jobRoleCategory.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return jobRoleCategory.Id;
        }
    }
}
