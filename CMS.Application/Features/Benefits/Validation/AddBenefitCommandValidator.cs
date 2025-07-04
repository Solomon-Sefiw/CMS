

using FluentValidation;
using CMS.Application.Features.Benefits.Commands.CreateBenefit;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Benefits.Validation
{
    public class AddBenefitCommandValidator : AbstractValidator<AddBenefitCommand>
    {
        private readonly IDataService _dataservice;
        public AddBenefitCommandValidator(IDataService dataservice)
        {
            _dataservice = dataservice;

            RuleFor(x => x.UnitOfMeasurementId).GreaterThan(0).WithMessage("measurement unit is required .");
            RuleFor(x => x.Name)
     .NotEmpty().WithMessage("Benefit name is required.")
     .Matches("^[A-Za-z ]+$").WithMessage("Benefit name must contain letters and spaces only.")
     .MustAsync(BeUniqueBenefit).WithMessage("Benefit already exists.");

        }
        private async Task<bool> BeUniqueBenefit(string name, CancellationToken cancellationtoken)
        {
            return !await _dataservice.Benefits
                .AnyAsync(x => x.Name.ToLower() == name.ToLower(), cancellationtoken);
        }
    }
}
