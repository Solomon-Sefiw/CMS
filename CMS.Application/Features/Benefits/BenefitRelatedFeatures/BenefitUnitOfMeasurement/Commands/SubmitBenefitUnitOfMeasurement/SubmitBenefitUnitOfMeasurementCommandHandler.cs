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
    public class SubmitBenefitUnitOfMeasurementCommandHandler : IRequestHandler<SubmitBenefitUnitOfMeasurementCommand, int>
    {
        private readonly IDataService _dataService;
        public SubmitBenefitUnitOfMeasurementCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(SubmitBenefitUnitOfMeasurementCommand request, CancellationToken cancellationToken)
        {
            var unitOfMeasurment = await _dataService.BenefitUnitOfMeasurements.Where(u => u.Id == request.Id).FirstOrDefaultAsync();
            if (unitOfMeasurment != null)
            {
                unitOfMeasurment.ApprovalStatus = ApprovalStatus.Submitted;
                unitOfMeasurment.Remark = request.remark;
            }
            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
