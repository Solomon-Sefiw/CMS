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
    public class GetNewEmployeesThisYearHandler : IRequestHandler<GetNewEmployeesThisYearQuery, NewEmployeesThisYearCount>
    {
        private readonly IDataService _dataService;

        public GetNewEmployeesThisYearHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<NewEmployeesThisYearCount> Handle(GetNewEmployeesThisYearQuery request, CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow;

            var currentFiscalStart = new DateTime(today.Month >= 7 ? today.Year : today.Year - 1, 7, 1);
            var currentFiscalEnd = currentFiscalStart.AddYears(1).AddDays(-1);

            var previousFiscalStart = currentFiscalStart.AddYears(-1);
            var previousFiscalEnd = currentFiscalEnd.AddYears(-1);

            var currentStartDate = DateOnly.FromDateTime(currentFiscalStart);
            var currentEndDate = DateOnly.FromDateTime(currentFiscalEnd);
            var prevStartDate = DateOnly.FromDateTime(previousFiscalStart);
            var prevEndDate = DateOnly.FromDateTime(previousFiscalEnd);

            var currentYearCount = await _dataService.Employees
                .Where(e => e.ApprovalStatus == ApprovalStatus.Approved &&
                            e.EmployeeStatus == EmployeeStatusEnum.Active &&
                            e.EmployementDate >= currentStartDate &&
                            e.EmployementDate <= currentEndDate)
                .CountAsync(cancellationToken);

            var previousYearCount = await _dataService.Employees
                .Where(e => e.ApprovalStatus == ApprovalStatus.Approved &&
                            e.EmployementDate >= prevStartDate &&
                            e.EmployementDate <= prevEndDate)
                .CountAsync(cancellationToken);

            string changeLabel;

            if (previousYearCount == 0)
            {
                changeLabel = "N/A";
            }
            else
            {
               double percent = previousYearCount == 0 ? 0 : ((double)(currentYearCount - previousYearCount) / previousYearCount) * 100;
                switch (percent)
                {
                    case > 0:
                        changeLabel = $"+{percent:0.0}% increase from last fiscal year";
                        break;
                    case < 0:
                        changeLabel = $"{Math.Abs(percent):0.0}% decrease from last fiscal year";
                        break;
                    default:
                        changeLabel = "No change from last fiscal year";
                        break;
                }

            }
            return new NewEmployeesThisYearCount(currentYearCount, changeLabel);
        }
    }
}
