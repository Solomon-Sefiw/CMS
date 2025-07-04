using FluentValidation;
using CMS.Domain;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Web;
namespace CMS.Application.Features.Job.JobRoles.Commands.DeactivateJobRole
{
    public class DeactivateJobRoleCommandValidator : AbstractValidator<DeactivateJobRoleCommand>
    {
        private readonly IDataService dataService;

        public DeactivateJobRoleCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(jobRole => jobRole)
                .MustAsync(IsJobRoleInUse)
                .WithMessage("This Job Role cannot be Deactivated as it is associated with Job.");
        }
        private async Task<bool> IsJobRoleInUse(DeactivateJobRoleCommand jobRole, CancellationToken cancellationToken)
        {
            return !await dataService.Jobs
                .AnyAsync(e => e.JobRoleId == jobRole.Id, cancellationToken);
        }
 
    }
}