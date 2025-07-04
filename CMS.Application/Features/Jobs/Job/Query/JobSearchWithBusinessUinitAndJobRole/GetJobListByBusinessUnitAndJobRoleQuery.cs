using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query.JobSearchWithBusinessUinitAndJobRole
{
    public record JobSearchResultByBusinessUnitAndJobRole(List<JobDto> Items, int? TotalCount);
    public record GetJobListByBusinessUnitAndJobRoleQuery(int? businessUnit, int? jobRole, int PageNumber = 0, int PageSize = 0) : IRequest<JobSearchResultByBusinessUnitAndJobRole>;
    
}
