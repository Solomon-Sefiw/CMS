using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{

    public class GetApprovedActiveJobRoleCountQueryHandler : IRequestHandler<GetApprovedActiveJobRoleCountQuery, ActiveJobRoleCount>
    {
        private readonly IDataService _dataService;
        public GetApprovedActiveJobRoleCountQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<ActiveJobRoleCount> Handle(GetApprovedActiveJobRoleCountQuery request, CancellationToken cancellationToken)
        {
            var current = await _dataService.JobRoles
               .Where(e => e.IsActive == ActivationEnum.Active &&
                      e.ApprovalStatus == ApprovalStatus.Approved)
                     .CountAsync(cancellationToken);

            var oneYearAgo = DateTime.UtcNow.AddYears(-1);

            var previous = await _dataService.JobRoles
                .TemporalAsOf(oneYearAgo)
                .Where(b => b.IsActive == ActivationEnum.Active &&
                            b.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            string changeLabel;

            if (previous == 0)
            {
                changeLabel = $"{current} new this year";
            }
            else
            {
                int change = current - previous;

                if (change > 0)
                    changeLabel = $"{change} new this year";
                else if (change < 0)
                    changeLabel = $"{Math.Abs(change)} fewer than last year";
                else
                    changeLabel = "No change since last year";
            }
            return new ActiveJobRoleCount(current, changeLabel);
        }
    }
}
