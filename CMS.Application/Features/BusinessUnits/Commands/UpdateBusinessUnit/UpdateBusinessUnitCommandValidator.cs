using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Services.DataService;

namespace CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit
{
    public class UpdateBusinessUnitCommandValidator : AbstractValidator<UpdateBusinessUnitCommand>
    {
        private readonly IDataService dataService;

        public UpdateBusinessUnitCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;


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
                    .GreaterThanOrEqualTo(1)
                    .WithMessage("Parent Business Unit Name Required");

            // Type must be a valid enum value
            RuleFor(bu => bu.Type)
                .IsInEnum()
                .WithMessage(" Business Unit Type Required");


            // StaffStrength must be greater than or equal to 0 if specified
            RuleFor(bu => bu.StaffStrength)
                .GreaterThanOrEqualTo(1)
                .When(bu => bu.StaffStrength.HasValue)
                .WithMessage("StaffStrength must be greater than or equal to 1.");


        }

    }
}
