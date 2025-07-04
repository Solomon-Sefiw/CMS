using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.RejectBranchGrade
{
    public class RejectBranchGradeCommandHandler : IRequestHandler<RejectBranchGradeCommand, int>
    {
        private readonly IDataService _dataService;
        public RejectBranchGradeCommandHandler(IDataService dataService)
        {
            _dataService = dataService;  
        }
        public async Task<int> Handle(RejectBranchGradeCommand request, CancellationToken cancellationToken)
        {
            var branchGrade = _dataService.BranchGrades.Where(j => j.Id == request.Id).FirstOrDefault();

            if (branchGrade != null)
            {
                branchGrade.ApprovalStatus = ApprovalStatus.Rejected;
                branchGrade.Remark = request.remark;
            }
            await _dataService.SaveAsync(cancellationToken);
            return branchGrade.Id;
        }
    }
}
