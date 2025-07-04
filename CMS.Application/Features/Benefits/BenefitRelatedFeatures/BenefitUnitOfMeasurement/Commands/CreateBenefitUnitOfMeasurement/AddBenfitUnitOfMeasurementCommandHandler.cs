
using CMS.Domain.Benefit;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.CreateBenefitUnitOfMeasurement
{
    public class AddBenfitUnitOfMeasurementCommandHandler : IRequestHandler<AddBenefitUnitOfMeasurementCommand, int>
    {
        private readonly IDataService _dataService;
        public AddBenfitUnitOfMeasurementCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(AddBenefitUnitOfMeasurementCommand request, CancellationToken cancellationToken)
        {
            var newUnitOfMeasurment = new CMS.Domain.Benefit. BenefitUnitOfMeasurement
            {
                Name = request.Name,
                IsUnitPriced = request.isUnitPriced,
                Description = request.Description,
            };

            _dataService.BenefitUnitOfMeasurements.Add(newUnitOfMeasurment);
            await _dataService.SaveAsync(cancellationToken);

            return newUnitOfMeasurment.Id;
        }
    }
}
