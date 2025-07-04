using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public record BranchGradeCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public record GetBranchGradeCountPerStatusQuery():IRequest<BranchGradeCountsByStatus>;

}
