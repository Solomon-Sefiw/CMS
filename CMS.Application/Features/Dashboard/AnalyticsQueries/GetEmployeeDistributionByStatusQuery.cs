using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public record EmployeeDistributionByStatusDto(string Name, int Value);
    public record GetEmployeeDistributionByStatusQuery() : IRequest<List<EmployeeDistributionByStatusDto>>;
}
