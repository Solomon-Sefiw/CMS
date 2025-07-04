using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public record MonthlyEmployeeCountDto(string Month, int Employees);
    public record GetMonthlyEmployeeCountQuery : IRequest<List<MonthlyEmployeeCountDto>>;

}
