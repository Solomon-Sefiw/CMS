using FluentValidation;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrice.Commands.CreateBenefitUnitPrice;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Validation
{
    public class AddBenefitUnitPriceCommandValidator : AbstractValidator<AddBenefitUnitPriceCommand>
    {
        private readonly IDataService _dataService;

        public AddBenefitUnitPriceCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.BenefitId)
                .GreaterThan(0).WithMessage("Benefit is required.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(x => x.EffectiveDate)
                .NotEmpty().WithMessage("Effective date is required.")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Effective date cannot be in the future.");

            RuleFor(x => x)
                .MustAsync(BeUniqueForBenefitAndDate).WithMessage("A unit price already exists for this benefit on the given effective date.");
        }

        private async Task<bool> BeUniqueForBenefitAndDate(AddBenefitUnitPriceCommand command, CancellationToken cancellationToken)
        {
            return !await _dataService.BenefitUnitPrices
                .AnyAsync(x => x.BenefitId == command.BenefitId && x.EffectiveDate.Date == command.EffectiveDate.Date, cancellationToken);
        }
    }
}
