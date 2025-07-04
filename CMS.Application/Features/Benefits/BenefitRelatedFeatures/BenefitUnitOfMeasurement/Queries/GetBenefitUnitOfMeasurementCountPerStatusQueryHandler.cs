using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries
{
    public class GetBenefitUnitOfMeasurementCountPerStatusQueryHandler : IRequestHandler<GetBenefitUnitOfMeasurementCountPerStatusQuery, BenefitUnitOfMeasurementCountsByStatus>
    {
        private readonly IDataService _dataService;
        public GetBenefitUnitOfMeasurementCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<BenefitUnitOfMeasurementCountsByStatus> Handle(GetBenefitUnitOfMeasurementCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.BenefitUnitOfMeasurements.Where(j => j.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await _dataService.BenefitUnitOfMeasurements.Where(j => j.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await _dataService.BenefitUnitOfMeasurements.Where(j => j.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await _dataService.BenefitUnitOfMeasurements.Where(j => j.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}
