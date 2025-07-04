using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.UpdateJobRoleCatagory
{

    public record UpdateJobRoleCatagoryCommand(int Id, string Name, string Description) : IRequest<int>;

    public class UpdateJobRoleCatagoryCommandHandler : IRequestHandler<UpdateJobRoleCatagoryCommand, int>
    {
        private readonly IDataService dataService;

        public UpdateJobRoleCatagoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateJobRoleCatagoryCommand command, CancellationToken cancellationToken)
        {
            var jobRoleCategory = await dataService.JobRoleCatagories.FindAsync(command.Id);
            jobRoleCategory.Name = command.Name;
            jobRoleCategory.Description = command.Description;
            jobRoleCategory.ApprovalStatus=ApprovalStatus.Draft;
            await dataService.SaveAsync(cancellationToken);
            return jobRoleCategory.Id;
        }
    }
}
