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
    public class GetResignedEmployeesThisYearHandler : IRequestHandler<GetResignedEmployeesThisYearQuery, ResignedEmployeesThisYearCount>
    {
        private readonly IDataService _dataService;

        public GetResignedEmployeesThisYearHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<ResignedEmployeesThisYearCount> Handle(GetResignedEmployeesThisYearQuery request, CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow;

            var currentFiscalStart = new DateTime(today.Month >= 7 ? today.Year : today.Year - 1, 7, 1);
            var currentFiscalEnd = currentFiscalStart.AddYears(1).AddDays(-1); // June 30

            var previousFiscalStart = currentFiscalStart.AddYears(-1);
            var previousFiscalEnd = currentFiscalEnd.AddYears(-1);

            var currentYearCount = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned &&
                            e.ModifiedAt >= currentFiscalStart &&
                            e.ModifiedAt <= currentFiscalEnd)
                .CountAsync(cancellationToken);

            var previousYearCount = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned &&
                            e.ModifiedAt >= previousFiscalStart &&
                            e.ModifiedAt <= previousFiscalEnd)
                .CountAsync(cancellationToken);

            string changeLabel;

            if (previousYearCount == 0)
            {
                changeLabel = "N/A";
            }
            else
            {
                double percent = ((double)(currentYearCount - previousYearCount) / previousYearCount) * 100;
                changeLabel = percent switch
                {
                    > 0 => $"+{percent:0.0}% increase from last fiscal year",
                    < 0 => $"{Math.Abs(percent):0.0}% decrease from last fiscal year",
                    _ => "No change from last fiscal year"
                };
            }
            return new ResignedEmployeesThisYearCount(currentYearCount, changeLabel);
        }
    }
}
