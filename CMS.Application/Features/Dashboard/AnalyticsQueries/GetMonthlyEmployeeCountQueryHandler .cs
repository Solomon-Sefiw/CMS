using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public class GetMonthlyEmployeeCountQueryHandler : IRequestHandler<GetMonthlyEmployeeCountQuery, List<MonthlyEmployeeCountDto>>
    {
        private readonly IDataService _dataServie;

        public GetMonthlyEmployeeCountQueryHandler(IDataService dataServie)
        {
            _dataServie = dataServie;
        }

        public async Task<List<MonthlyEmployeeCountDto>> Handle(GetMonthlyEmployeeCountQuery request, CancellationToken cancellationToken)
        {
            var now = DateTime.Now;
            int fiscalYearStart = now.Month >= 7 ? now.Year : now.Year - 1;

            var fiscalStart = new DateOnly(fiscalYearStart, 7, 1);
            var fiscalEnd = new DateOnly(fiscalYearStart + 1, 6, 30);

            var rawResult = await _dataServie.Employees
                .Where(e => e.EmployementDate >= fiscalStart &&
                            e.EmployementDate <= fiscalEnd &&
                            e.EmployeeStatus == EmployeeStatusEnum.Active)
                .GroupBy(e => e.EmployementDate.Month)
                .Select(g => new
                {
                    MonthNumber = g.Key,
                    Count = g.Count()
                })
                .ToListAsync(cancellationToken);

            // Sort July–June
            var fiscalMonthOrder = Enumerable.Range(7, 6).Concat(Enumerable.Range(1, 6)).ToList();

            var result = rawResult
                .OrderBy(x => fiscalMonthOrder.IndexOf(x.MonthNumber))
                .Select(x => new MonthlyEmployeeCountDto(
                    Month: CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(x.MonthNumber),
                    Employees: x.Count
                ))
                .ToList();

            return result;

        }

    }

}
