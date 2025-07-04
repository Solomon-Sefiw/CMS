using FluentValidation;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.UpdateBenefitValue;
using CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Validation
{
    public class UpdateBenefitValueCommandValidator : AbstractValidator<UpdateBenefitValueCommand>
    {
        private readonly IDataService _dataService;
        public UpdateBenefitValueCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.value)
                 .GreaterThan(0).WithMessage("Value is required.")
                 .MustAsync(BeUniqueBenefitValue).WithMessage("Benefit value already exists.");

            RuleFor(x => x.benefitId).GreaterThan(0).WithMessage("Benefit required.");
            RuleFor(x => x.description)
              .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
              .When(x => !string.IsNullOrWhiteSpace(x.description));

        }
        private async Task<bool> BeUniqueBenefitValue(UpdateBenefitValueCommand request, decimal value, CancellationToken cancellationToken)
        {
            return !await _dataService.BenefitValues
                .AnyAsync(x => x.Value == value && x.Id != request.Id, cancellationToken);
        }
    }
}
