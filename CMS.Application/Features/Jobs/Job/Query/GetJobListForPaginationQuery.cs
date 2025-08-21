using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{

    public record JobSearchResult(List<JobDto> Items, int TotalCount);
    public record GetJobListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<JobSearchResult>;
}
