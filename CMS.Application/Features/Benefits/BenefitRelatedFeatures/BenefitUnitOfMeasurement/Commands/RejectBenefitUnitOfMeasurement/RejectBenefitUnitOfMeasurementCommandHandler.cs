using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.RejectBenefitUnitOfMeasurement
{
    class RejectBenefitUnitOfMeasurementCommandHandler : IRequestHandler<RejectBenefitUnitOfMeasurementCommand, int>
    {
        private readonly IDataService _dataService;
        public RejectBenefitUnitOfMeasurementCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(RejectBenefitUnitOfMeasurementCommand request, CancellationToken cancellationToken)
        {
            var unitOfMeasurment = await _dataService.BenefitUnitOfMeasurements.Where(u => u.Id == request.Id).FirstOrDefaultAsync();
            if (unitOfMeasurment != null)
            {
                unitOfMeasurment.ApprovalStatus = ApprovalStatus.Rejected;
                unitOfMeasurment.Remark = request.remark;
            }
            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
