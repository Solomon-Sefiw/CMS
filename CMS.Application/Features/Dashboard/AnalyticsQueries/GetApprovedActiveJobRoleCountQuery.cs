using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public record ActiveJobRoleCount(int Total, string ChangeLabel);
    public record GetApprovedActiveJobRoleCountQuery() : IRequest<ActiveJobRoleCount>;

}
