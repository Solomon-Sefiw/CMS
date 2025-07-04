using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.SubmitBranchGrade
{
    public class SubmitBranchGradeCommandHandler : IRequestHandler<SubmitBranchGradeCommand, int>
    {
        private readonly IDataService _dataService;
        public SubmitBranchGradeCommandHandler(IDataService dataService)
        {
            _dataService = dataService;  
        }
        public async Task<int> Handle(SubmitBranchGradeCommand request, CancellationToken cancellationToken)
        {
            var branchGrade = _dataService.BranchGrades.Where(j => j.Id == request.Id).FirstOrDefault();

            if (branchGrade != null)
            {
                branchGrade.ApprovalStatus = ApprovalStatus.Submitted;
                branchGrade.Remark = request.remark;
            }
            await _dataService.SaveAsync(cancellationToken);
            return branchGrade.Id;
        }
    }
}
