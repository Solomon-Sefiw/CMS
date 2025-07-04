using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public record VacantJobsCount(int Total, string ChangeLabel);
    public record GetVacantJobsCountQuery() : IRequest<VacantJobsCount>;
}
