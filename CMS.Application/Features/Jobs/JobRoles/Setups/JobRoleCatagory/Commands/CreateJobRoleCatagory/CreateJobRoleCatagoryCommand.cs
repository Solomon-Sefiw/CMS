using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.CreateJobRoleCatagory
{
    public record CreateJobRoleCatagoryCommand(string Name, string Description) : IRequest<int>;
    public class CreateJobRoleCatagoryCommandHandler : IRequestHandler<CreateJobRoleCatagoryCommand, int>
    {
        private readonly IDataService dataService;

        public CreateJobRoleCatagoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateJobRoleCatagoryCommand command, CancellationToken cancellationToken)
        {
            var jobRoleCategory = new JobRoleCategory
            {
                Name = command.Name,
                Description = command.Description
            };

            dataService.JobRoleCatagories.Add(jobRoleCategory);
            await dataService.SaveAsync(cancellationToken);

            return jobRoleCategory.Id;
        }
    }
}
