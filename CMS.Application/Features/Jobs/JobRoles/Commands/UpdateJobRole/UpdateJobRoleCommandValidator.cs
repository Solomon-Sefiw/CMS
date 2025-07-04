using FluentValidation;
using CMS.Domain;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.UpdateJobRole
{
    public class UpdateJobRoleCommandValidator : AbstractValidator<UpdateJobRoleCommand>
    {
        private readonly IDataService dataService;

        public UpdateJobRoleCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(JobRole => JobRole.RoleName)
                .NotEmpty().WithMessage(" Job Role Name is required.");
            RuleFor(JobRole => JobRole.JobCatagoryId)
                .NotEmpty().WithMessage("JobRole Catagory is required.");
            RuleFor(JobRole => JobRole.JobRoleCategoryId)
                .NotEmpty().WithMessage("JobRole Role Catagory is required.");
            RuleFor(JobRole => JobRole.JobGradeId)
                          .NotEmpty().WithMessage("JobRole Grade is required.");
            RuleFor(JobRole => JobRole.Description)
              .NotEmpty().WithMessage("Job Role Description is required.");
          
            RuleFor(jobRole => jobRole)
                .MustAsync(IsJobRoleInUse)
                .WithMessage("This Job Role cannot be updated as it is associated with Job.");

            RuleFor(x => x.Benefits)
                  .NotNull().WithMessage("At least one benefit is required.")
                  .Must(b => b.Count > 0).WithMessage("At least one benefit must be selected.");

            RuleForEach(x => x.Benefits).ChildRules(benefit =>
            {
                benefit.RuleFor(b => b.BenefitId)
                    .NotEmpty().WithMessage("Benefit is required.");

                benefit.RuleFor(b => b.BenefitValueId)
                    .NotEmpty().WithMessage("Benefit Value is required.");
     
            });

        }
        private bool IsJobRoleUniqu(UpdateJobRoleCommand command) =>
            !dataService.JobRoles.Any(JobRole => JobRole.RoleName == command.RoleName);
        private async Task<bool> IsJobRoleInUse(UpdateJobRoleCommand jobRole, CancellationToken cancellationToken)
        {
            return !await dataService.Jobs
                .AnyAsync(e => e.JobRoleId == jobRole.Id, cancellationToken);
        }
    }
}