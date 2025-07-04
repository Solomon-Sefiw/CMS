using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.ApproveBenefitUnitOfMeasurement
{
    public class ApproveBenefitUnitOfMeasurementCommandHandler : IRequestHandler<ApproveBenefitUnitOfMeasurementCommand, int>
    {
        private readonly IDataService _dataService;
        public ApproveBenefitUnitOfMeasurementCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(ApproveBenefitUnitOfMeasurementCommand request, CancellationToken cancellationToken)
        {
            var unitOfMeasurment = await _dataService.BenefitUnitOfMeasurements.Where(u => u.Id == request.Id).FirstOrDefaultAsync();
            if (unitOfMeasurment != null)
            {
                unitOfMeasurment.ApprovalStatus = ApprovalStatus.Approved;
                unitOfMeasurment.Remark = request.remark;
            }
            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
