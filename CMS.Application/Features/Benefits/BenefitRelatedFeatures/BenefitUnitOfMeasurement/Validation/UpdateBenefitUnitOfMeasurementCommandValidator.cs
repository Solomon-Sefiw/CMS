using FluentValidation;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.UpdateBenefitUnitOfMeasurement;
using CMS.Application.Features.Benefits.Commands.UpdateBenefit;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Validation
{
    public class UpdateBenefitUnitOfMeasurementCommandValidator : AbstractValidator<UpdateBenefitUnitOfMeasurementCommand>
    {
        private readonly IDataService _dataService;
        public UpdateBenefitUnitOfMeasurementCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.Name)
                 .NotEmpty().WithMessage("Unit Of Measurement name is required.")
                 .Matches("^[a-zA-Z ]+$").WithMessage("Unit Of Measurement name must contain letters only.")
                 .MustAsync(BeUniqueUnitOfMeasurement).WithMessage("Unit Of Measurement already exists.");
        }
        private async Task<bool> BeUniqueUnitOfMeasurement(UpdateBenefitUnitOfMeasurementCommand model, string grade, CancellationToken cancellationToken)
        {
            return !await _dataService.BenefitUnitOfMeasurements
                .AnyAsync(x => x.Name.ToLower() == grade.ToLower() && x.Id != model.Id, cancellationToken);
        }
    }
}
