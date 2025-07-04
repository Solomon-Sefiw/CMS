using CMS.Domain.BranchGrade;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.CreateBranchGrade
{
    public class AddBranchGradeCommandHandler : IRequestHandler<AddBranchGradeCommand, int>
    {
        private readonly IDataService _dataService;
        public AddBranchGradeCommandHandler(IDataService dataService)
        {
            _dataService = dataService;   
        }
        public async Task<int> Handle(AddBranchGradeCommand request, CancellationToken cancellationToken)
        {
            var newBranchGrade = new BranchGrade()
            { 
             Grade= request.grade,
             StaffLimit= request.staffLimit,
             Description= request.description,
            };
            await _dataService.BranchGrades.AddAsync(newBranchGrade);
            await _dataService.SaveAsync(cancellationToken);
            return request.staffLimit;
        }
    }
}
