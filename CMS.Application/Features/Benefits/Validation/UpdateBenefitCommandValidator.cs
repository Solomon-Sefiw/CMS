using FluentValidation;
using CMS.Application.Features.Benefits.Commands.UpdateBenefit;
using CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Validation
{
    public class UpdateBenefitCommandValidator : AbstractValidator<UpdateBenefitCommand>
    {
        private readonly IDataService _dataService;
        public UpdateBenefitCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.UnitOfMeasurementId).GreaterThan(0).WithMessage("Measurement unit is required.");
            RuleFor(x => x.Name)
              .NotEmpty().WithMessage("Benefit name is required.")
              .Matches("^[a-zA-Z ]+$").WithMessage("Benefit name must contain letters only.")
              .MustAsync(BeUniqueBenefit).WithMessage("Benefit already exists.");
        }
        private async Task<bool> BeUniqueBenefit(UpdateBenefitCommand model, string grade, CancellationToken cancellationToken)
        {
            return !await _dataService.Benefits
                .AnyAsync(x => x.Name.ToLower() == grade.ToLower() && x.Id != model.Id, cancellationToken);
        }
    }
}
