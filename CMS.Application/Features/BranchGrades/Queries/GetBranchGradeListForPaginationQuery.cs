using CMS.Application.Features.BranchGrades.Model;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Application.Features.Jobs.Job.Query;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public record BranchGradeSearchResult(List<BranchGradeDto> Items, int TotalCount);
    public record GetBranchGradeListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<BranchGradeSearchResult>;

}
