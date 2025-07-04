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
    public class GetApprovedActiveEmployeeCountHandler : IRequestHandler<GetApprovedActiveEmployeeCountQuery, ApprovedActiveEmployeeCount>
    {
        private readonly IDataService _dataService;
        public GetApprovedActiveEmployeeCountHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<ApprovedActiveEmployeeCount> Handle(GetApprovedActiveEmployeeCountQuery request, CancellationToken cancellationToken)
        {
            var current = await _dataService.Employees
                 .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active &&
                             e.ApprovalStatus == ApprovalStatus.Approved)
                 .CountAsync(cancellationToken);

            var oneYearAgo = DateOnly.FromDateTime(DateTime.Now.AddYears(-1));

            var previous = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active &&
                            e.ApprovalStatus == ApprovalStatus.Approved &&
                            e.EmployementDate <= oneYearAgo)
                .CountAsync(cancellationToken);

            string changeLabel;

            if (previous == 0)
            {
                changeLabel = "N/A";
            }
            else
            {
                double percent = previous == 0? 0: ((double)(current - previous) / previous) * 100;

                changeLabel = percent switch
                {
                    > 0 => $"+{percent:0.0}% increase since last year",
                    < 0 => $"{Math.Abs(percent):0.0}% decrease since last year",
                    _ => "No change since last year"
                };

            }
            return new ApprovedActiveEmployeeCount(current, changeLabel);
        }
    }
}
