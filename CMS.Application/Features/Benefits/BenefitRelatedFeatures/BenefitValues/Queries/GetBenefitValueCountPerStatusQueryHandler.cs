using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public class GetBenefitValueCountPerStatusQueryHandler : IRequestHandler<GetBenefitValueCountPerStatusQuery, BenefitValueCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetBenefitValueCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<BenefitValueCountsByStatus> Handle(GetBenefitValueCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.BenefitValues.Where(j => j.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await _dataService.BenefitValues.Where(j => j.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await _dataService.BenefitValues.Where(j => j.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await _dataService.BenefitValues.Where(j => j.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}
