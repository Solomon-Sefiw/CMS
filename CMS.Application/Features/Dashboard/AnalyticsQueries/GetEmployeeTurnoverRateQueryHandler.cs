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
    public class GetEmployeeTurnoverRateQueryHandler : IRequestHandler<GetEmployeeTurnoverRateQuery, EmployeeTurnoverRate>
    {
        private readonly IDataService _dataService;

        public GetEmployeeTurnoverRateQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<EmployeeTurnoverRate> Handle(GetEmployeeTurnoverRateQuery request, CancellationToken cancellationToken)
        {
            var oneYearAgo = DateOnly.FromDateTime(DateTime.Now.AddYears(-1));

            var oneYearAgoInUTC = DateTime.UtcNow.AddYears(-1);

            // Employees currently active
            var currentActive = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active)
                .CountAsync(cancellationToken);

            var previousActive = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active &&
                            e.ApprovalStatus == ApprovalStatus.Approved &&
                            e.EmployementDate <= oneYearAgo)
                .CountAsync(cancellationToken);

            var ressignedLastYear = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned && e.ModifiedAt >= oneYearAgoInUTC)
                .CountAsync(cancellationToken);

            var avgEmployees = (previousActive + currentActive) / 2.0;

            double turnoverRate = avgEmployees == 0 ? 0 : (ressignedLastYear / avgEmployees) * 100;

            var twoYearsAgo = oneYearAgoInUTC.AddYears(-1);

            var activeBeforeLastYear = await _dataService.Employees
                .TemporalAsOf(twoYearsAgo)
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active)
                .CountAsync(cancellationToken);

            var activeOneYearAgo = previousActive;

            var leftBetweenTwoYearsAgo = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned &&
                            e.ModifiedAt >= twoYearsAgo &&
                            e.ModifiedAt < oneYearAgoInUTC)
                .CountAsync(cancellationToken);

            var avgPrevYear = (activeBeforeLastYear + activeOneYearAgo) / 2.0;
            double prevTurnoverRate = avgPrevYear == 0 ? 0 : (leftBetweenTwoYearsAgo / avgPrevYear) * 100;

            double change = turnoverRate - prevTurnoverRate;

            string changeLabel;

            switch (change)
            {
                case > 0:
                    changeLabel = $"+{change:0.0}% increase from last year";
                    break;
                case < 0:
                    changeLabel = $"{Math.Abs(change):0.0}% decrease from last year";
                    break;
                default:
                    changeLabel = "No change from last year";
                    break;
            }


            return new EmployeeTurnoverRate($"{turnoverRate:0.0}%", changeLabel);
        }
    }
}
