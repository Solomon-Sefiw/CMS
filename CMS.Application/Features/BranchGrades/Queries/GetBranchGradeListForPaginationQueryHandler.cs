using AutoMapper;
using CMS.Application.Features.BranchGrades.Model;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Application.Features.Jobs.Job.Query;
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
    public class GetBranchGradeListForPaginationQueryHandler : IRequestHandler<GetBranchGradeListForPaginationQuery, BranchGradeSearchResult>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;
        public GetBranchGradeListForPaginationQueryHandler(IDataService dataService,IMapper mapper)
        {
            _dataService = dataService;  
            _mapper = mapper;
        }
        public async Task<BranchGradeSearchResult> Handle(GetBranchGradeListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var branchGradeQuery = _dataService.BranchGrades.AsQueryable();

            branchGradeQuery = branchGradeQuery.Where(j => j.ApprovalStatus == request.Status);
            var branchGradePaginated = branchGradeQuery
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize);

            var branchGradeList = await branchGradePaginated.ToListAsync(cancellationToken);
            var count = await branchGradeQuery.CountAsync(cancellationToken);

            var result = branchGradeList.Select(branchGrade => new BranchGradeDto
            {
               Id= branchGrade.Id,
               Grade=branchGrade.Grade,
               StaffLimit=branchGrade.StaffLimit,
               Description=branchGrade.Description,
               Remark=branchGrade.Remark,
               ApprovalStatus=branchGrade.ApprovalStatus,
            }).ToList();

            return new BranchGradeSearchResult(result, count);
        }
    }
}
