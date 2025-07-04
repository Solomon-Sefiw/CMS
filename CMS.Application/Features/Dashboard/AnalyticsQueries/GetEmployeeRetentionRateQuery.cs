using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    using MediatR;
        public record EmployeeRetentionRate(string Rate, string ChangeLabel);
        public record GetEmployeeRetentionRateQuery() : IRequest<EmployeeRetentionRate>;
}
