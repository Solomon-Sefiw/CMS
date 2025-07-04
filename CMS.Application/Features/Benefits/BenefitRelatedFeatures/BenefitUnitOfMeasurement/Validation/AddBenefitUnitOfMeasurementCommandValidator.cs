//using FluentValidation;
//using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.CreateBenefitUnitOfMeasurement;
//using CMS.Application.Features.Benefits.Commands.CreateBenefit;
//using CMS.Services.DataService;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Validation
//{
//    public class AddBenefitUnitOfMeasurementCommandValidator : AbstractValidator<AddBenefitUnitOfMeasurementCommand>
//    {
//        private readonly IDataService _dataService;
//        public AddBenefitUnitOfMeasurementCommandValidator(IDataService dataService)
//        {
//            _dataService = dataService;

//            RuleFor(x => x.Name)
//                .NotEmpty().WithMessage("Unit Of Measurement name is required.")
//                .Matches("^[a-zA-Z ]+$").WithMessage("Unit Of Measurement name must contain letters only.")
//                .MustAsync(BeUniqueUnitOfMeasurement).WithMessage("Unit Of Measurement already exists.");
//        }
//        private async Task<bool> BeUniqueUnitOfMeasurement(string name, CancellationToken cancellationToken)
//        {
//            return !await _dataService.BenefitUnitOfMeasurements
//                .AnyAsync(x => x.Name.ToLower() == name.ToLower(), cancellationToken);
//        }
//    }
//}
