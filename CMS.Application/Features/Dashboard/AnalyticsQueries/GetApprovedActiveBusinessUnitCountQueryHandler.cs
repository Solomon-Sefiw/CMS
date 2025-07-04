using CMS.Domain.Enum;
using CMS.Domain.Enums;
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
    public class GetApprovedActiveBusinessUnitCountQueryHandler : IRequestHandler<GetApprovedActiveBusinessUnitCountQuery, ActiveBusinessUnitCount>
    {
        private readonly IDataService _dataService;
        public GetApprovedActiveBusinessUnitCountQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<ActiveBusinessUnitCount> Handle(GetApprovedActiveBusinessUnitCountQuery request, CancellationToken cancellationToken)
        {
            var current = await _dataService.BusinessUnits
          .Where(e => e.Status == Status.Active &&
                      e.ApprovalStatus == ApprovalStatus.Approved)
          .CountAsync(cancellationToken);

            var oneYearAgo = DateTime.Now.AddYears(-1);

            var previous = await _dataService.BusinessUnits
                .TemporalAsOf(oneYearAgo)
                .Where(b => b.Status == Status.Active &&
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
            return new ActiveBusinessUnitCount(current, changeLabel);
        }
    }
}
