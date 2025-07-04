using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade
{
    public class UpdateBranchGradeCommandHandler : IRequestHandler<UpdateBranchGradeCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateBranchGradeCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(UpdateBranchGradeCommand request, CancellationToken cancellationToken)
        {
            var existingBranchGrade = await _dataService.BranchGrades.FindAsync(request.Id);
            if (existingBranchGrade == null)
                throw new KeyNotFoundException($"BranchGrade with Id {request.Id} not found.");

            existingBranchGrade.Grade = request.grade;
            existingBranchGrade.StaffLimit = request.staffLimit;
            existingBranchGrade.Description = request.description;
            existingBranchGrade.ApprovalStatus= ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
