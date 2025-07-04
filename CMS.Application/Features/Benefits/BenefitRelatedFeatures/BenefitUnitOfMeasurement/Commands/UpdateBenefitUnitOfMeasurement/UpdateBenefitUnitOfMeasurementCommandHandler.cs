using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.UpdateBenefitUnitOfMeasurement
{
    public class UpdateBenefitUnitOfMeasurementCommandHandler : IRequestHandler<UpdateBenefitUnitOfMeasurementCommand, int>
    {
        private readonly IDataService _dataService;
        public UpdateBenefitUnitOfMeasurementCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(UpdateBenefitUnitOfMeasurementCommand request, CancellationToken cancellationToken)
        {
            var existingUnitOfMeasurements = await _dataService.BenefitUnitOfMeasurements.FindAsync(request.Id);
            if (existingUnitOfMeasurements != null)
            {
                existingUnitOfMeasurements.Name = request.Name;
                existingUnitOfMeasurements.IsUnitPriced = request.isUnitPriced;
                existingUnitOfMeasurements.Description = request.Description;
                existingUnitOfMeasurements.ApprovalStatus = ApprovalStatus.Draft;
            }

            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
