using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Application.Features.BranchGrades.Model;
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
    public class GetBranchGradeByDescriptionQueryHandler : IRequestHandler<GetBranchGradeByDescriptionQuery, List<BranchGradeDto>>
    {
        private readonly IDataService _dataService;
        public GetBranchGradeByDescriptionQueryHandler(IDataService dataService)
        {
            _dataService=dataService;
        }
        public async Task<List<BranchGradeDto>> Handle(GetBranchGradeByDescriptionQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.description) || request.description.Length < 2)
                return null;

            var filteredGrade = await _dataService.BranchGrades
        .Where(bg => !string.IsNullOrEmpty(bg.Description) &&
                     bg.Description.ToLower().Contains(request.description.ToLower()))
        .Select(bg => new BranchGradeDto
        {
            Id = bg.Id,
            Grade = bg.Grade,
            StaffLimit = bg.StaffLimit,
            Description = bg.Description,
            Remark = bg.Remark,
            ApprovalStatus = bg.ApprovalStatus
        })
        .ToListAsync(cancellationToken);



            return filteredGrade;
        }

    }
}
