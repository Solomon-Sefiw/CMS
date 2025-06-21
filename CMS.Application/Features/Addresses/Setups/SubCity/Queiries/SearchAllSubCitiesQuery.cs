using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Queiries
{
    public record SearchAllSubCitiesQuery : IRequest<List<SubCityDto>>;
    internal class SearchAllSubCitiesQueryHandler : IRequestHandler<SearchAllSubCitiesQuery, List<SubCityDto>>
    {
        private readonly IDataService dataService;

        public SearchAllSubCitiesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<SubCityDto>> Handle(SearchAllSubCitiesQuery request, CancellationToken cancellationToken)
        {
            var subCities = await dataService.SubCities.ToListAsync(cancellationToken);
            return subCities.Select(subCity => new SubCityDto
            (
                subCity.Id,
                subCity.Name,
                subCity.Description,
                subCity.RegionId,
                subCity.Region?.Name,
                subCity.ApprovalStatus
            )).ToList();
        }
    }
}
