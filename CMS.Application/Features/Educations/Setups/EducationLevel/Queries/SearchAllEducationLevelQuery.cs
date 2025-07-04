using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Queries
{

    public record SearchAllEducationLevelQuery : IRequest<List<EducationLevelDto>>;
    internal class SearchAllEducationLevelQueryHandler : IRequestHandler<SearchAllEducationLevelQuery, List<EducationLevelDto>>
    {
        private readonly IDataService dataService;

        public SearchAllEducationLevelQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<EducationLevelDto>> Handle(SearchAllEducationLevelQuery request, CancellationToken cancellationToken)
        {
            var educationLevels = await dataService.EducationLevels
                .Select(a => new EducationLevelDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);
            return educationLevels;
        }
    }
}
