using FluentValidation;
using CMS.Services.DataService;

namespace CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit
{
    public class CreateBusinessUnitCommandValidator : AbstractValidator<CreateBusinessUnitCommand>
    {
        private readonly IDataService dataService;

        public CreateBusinessUnitCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(bu => bu).Must(IsBusinessUnitUnique).WithMessage("BusinessUnit Name Already Exist");
            // Name is required and should not exceed 100 characters
            RuleFor(bu => bu.Name)
                .NotEmpty()
                .WithMessage("BusinessUnit Name is required.")
                .Matches(@"^[a-zA-Z0-9 ]+$")
                .WithMessage("BusinessUnit Name must be alphanumeric and can include spaces.")
                .MaximumLength(100)
                .WithMessage("BusinessUnit Name must not exceed 100 characters.") // Corrected to 100 characters
                .MinimumLength(3)
                .WithMessage("BusinessUnit Name must be at least 3 characters long.");



            // ParentId must be greater than or equal to 0
            RuleFor(bu => bu.ParentId)
                    .NotNull()
                    .WithMessage("Parent Business Unit Required")
                    .GreaterThanOrEqualTo(1)
                    .WithMessage("Parent Business Unit Required");

                // Type must be a valid enum value
                RuleFor(bu => bu.Type)
                    .IsInEnum()
                    .WithMessage(" Business Unit Type Required");




            // StaffStrength must be greater than or equal to 0 if specified
            RuleFor(bu => bu.StaffStrength)
                    .GreaterThanOrEqualTo(1)
                    .When(bu => bu.StaffStrength.HasValue)
                    .WithMessage("StaffStrength must Not equal to 0.");

        }
        private bool IsBusinessUnitUnique(CreateBusinessUnitCommand command) => !dataService.BusinessUnits.Any(x => x.Name == command.Name);
    

    }
}
