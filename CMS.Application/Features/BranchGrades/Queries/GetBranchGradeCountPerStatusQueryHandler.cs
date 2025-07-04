using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public class GetBranchGradeCountPerStatusQueryHandler : IRequestHandler<GetBranchGradeCountPerStatusQuery, BranchGradeCountsByStatus>
    {
        private readonly IDataService _dataService;
        public GetBranchGradeCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService= dataService;
        }
        public async Task<BranchGradeCountsByStatus> Handle(GetBranchGradeCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.BranchGrades.Where(j => j.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await _dataService.BranchGrades.Where(j => j.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await _dataService.BranchGrades.Where(j => j.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await _dataService.BranchGrades.Where(j => j.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}
