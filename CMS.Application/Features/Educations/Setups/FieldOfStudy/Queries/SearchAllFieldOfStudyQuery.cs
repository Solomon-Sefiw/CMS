using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Queries
{
    public record SearchAllFieldOfStudyQuery : IRequest<List<FieldOfStudyDto>>;
    internal class SearchAllFieldOfStudyQueryHandler : IRequestHandler<SearchAllFieldOfStudyQuery, List<FieldOfStudyDto>>
    {
        private readonly IDataService dataService;

        public SearchAllFieldOfStudyQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<FieldOfStudyDto>> Handle(SearchAllFieldOfStudyQuery request, CancellationToken cancellationToken)
        {
            var awards = await dataService.FieldOfStudies
                .Select(a => new FieldOfStudyDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);
            return awards;
        }
    }
}
