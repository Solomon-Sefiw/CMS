using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Queries
{
    public record SearchAllInstitutionNameQuery : IRequest<List<InstitutionNameDto>>;
    internal class SearchAllAwardQueryHandler : IRequestHandler<SearchAllInstitutionNameQuery, List<InstitutionNameDto>>
    {
        private readonly IDataService dataService;

        public SearchAllAwardQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<InstitutionNameDto>> Handle(SearchAllInstitutionNameQuery request, CancellationToken cancellationToken)
        {
            var institutionNames = await dataService.InstitutionNames
                .Select(a => new InstitutionNameDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);
            return institutionNames;
        }
    }
}
