using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Queries
{
    public class GetBenefitCountByStatusQueryHandler : IRequestHandler<GetBenefitCountByStatusQuery, BenefitCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetBenefitCountByStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<BenefitCountsByStatus> Handle(GetBenefitCountByStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.Benefits.CountAsync(b => b.ApprovalStatus == ApprovalStatus.Approved, cancellationToken);
            var approvalRequests = await _dataService.Benefits.CountAsync(b => b.ApprovalStatus == ApprovalStatus.Submitted, cancellationToken);
            var rejected = await _dataService.Benefits.CountAsync(b => b.ApprovalStatus == ApprovalStatus.Rejected, cancellationToken);
            var drafts = await _dataService.Benefits.CountAsync(b => b.ApprovalStatus == ApprovalStatus.Draft, cancellationToken);

            return new BenefitCountsByStatus(approved, approvalRequests, rejected, drafts);
        }
    }
}
