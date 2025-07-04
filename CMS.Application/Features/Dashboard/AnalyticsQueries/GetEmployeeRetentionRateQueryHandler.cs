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
    public class GetEmployeeRetentionRateQueryHandler : IRequestHandler<GetEmployeeRetentionRateQuery, EmployeeRetentionRate>
    {
        private readonly IDataService _dataService;

        public GetEmployeeRetentionRateQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<EmployeeRetentionRate> Handle(GetEmployeeRetentionRateQuery request, CancellationToken cancellationToken)
        {
            var oneYearAgo = DateOnly.FromDateTime(DateTime.Now.AddYears(-1));
            var oneYearAgoUtc = DateTime.UtcNow.AddYears(-1);

            var currentActive = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active)
                .CountAsync(cancellationToken);

            var previousActive = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active &&
                            e.ApprovalStatus == ApprovalStatus.Approved &&
                            e.EmployementDate <= oneYearAgo)
                .CountAsync(cancellationToken);

            var resignedLastYear = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned && e.ModifiedAt >= oneYearAgoUtc)
                .CountAsync(cancellationToken);

            var avgEmployees = (previousActive + currentActive) / 2.0;

            double turnoverRate = avgEmployees == 0 ? 0 : (resignedLastYear / avgEmployees) * 100;

            double retentionRate = 100 - turnoverRate;


            var twoYearsAgo = oneYearAgoUtc.AddYears(-1);

            var activeBeforeLastYear = await _dataService.Employees
                .TemporalAsOf(twoYearsAgo)
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active)
                .CountAsync(cancellationToken);

            var leftBetweenTwoYearsAgo = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned &&
                            e.ModifiedAt >= twoYearsAgo &&
                            e.ModifiedAt < oneYearAgoUtc)
                .CountAsync(cancellationToken);

            var avgPrevious = (activeBeforeLastYear + previousActive) / 2.0;

            double prevTurnoverRate = avgPrevious == 0 ? 0 : (leftBetweenTwoYearsAgo / avgPrevious) * 100;

            double prevRetentionRate = 100 - prevTurnoverRate;

            double change = retentionRate - prevRetentionRate;

            string changeLabel;

            switch (change)
            {
                case > 0:
                    changeLabel = $"+{change:0.0}% increase from last year";
                    break;
                case < 0:
                    changeLabel = $"{change:0.0}% decrease from last year";
                    break;
                default:
                    changeLabel = "No change from last year";
                    break;
            }
            return new EmployeeRetentionRate($"{retentionRate:0.0}%", changeLabel);
        }
    }
}
