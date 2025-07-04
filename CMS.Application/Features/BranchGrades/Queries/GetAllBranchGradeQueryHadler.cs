using AutoMapper;
using CMS.Application.Features.BranchGrades.Model;
using CMS.Domain.BranchGrade;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public class GetAllBranchGradeQueryHadler : IRequestHandler<GetAllBranchGradeQuery, List<BranchGrade>>
    {
        private readonly IDataService _dataService;

        public GetAllBranchGradeQueryHadler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<BranchGrade>> Handle(GetAllBranchGradeQuery request, CancellationToken cancellationToken)
        {
            return await _dataService.BranchGrades.ToListAsync(cancellationToken);
        }
    }
}
