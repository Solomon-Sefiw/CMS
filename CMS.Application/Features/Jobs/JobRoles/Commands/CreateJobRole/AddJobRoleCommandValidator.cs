using FluentValidation;
using CMS.Domain;
using CMS.Services.DataService;
using System.Text.RegularExpressions;
using System.Web;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.CreateJobRole
{
    public class AddJobRoleCommandValidator : AbstractValidator<AddJobRoleCommand>
    {
        private readonly IDataService dataService;

        public AddJobRoleCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(JobRole => JobRole.RoleName)
                .NotEmpty().WithMessage(" Job Role Name is required.");
            RuleFor(JobRole => JobRole.JobCatagoryId)
                .NotEmpty().WithMessage("JobRole Catagory is required.");
            RuleFor(JobRole => JobRole.JobRoleCategoryId)
                .NotEmpty().WithMessage("JobRole Role Catagory is required.");
            RuleFor(JobRole => JobRole.Description)
              .NotEmpty().WithMessage("Job Role Description is required.")
              .Must(BeValidDescription).WithMessage("Spaces in job role description are not allowed.");
            RuleFor(JobRole=> JobRole).Must(IsJobRoleUniqu).WithMessage("Job Role Already Exist");

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
       private bool IsJobRoleUniqu(AddJobRoleCommand command) => 
            !dataService.JobRoles.Any(JobRole => JobRole.RoleName == command.RoleName);
        private bool BeValidDescription(string description)
        {
            var plainText = StripHtml(description);
            bool containsNonWhitespaceCharacter = plainText.Any(c => !char.IsWhiteSpace(c));
            return containsNonWhitespaceCharacter;
        }
        private string StripHtml(string input)
        {
            return string.IsNullOrWhiteSpace(input) ? input : Regex.Replace(HttpUtility.HtmlDecode(input), "<.*?>", string.Empty);
        }
    }
}