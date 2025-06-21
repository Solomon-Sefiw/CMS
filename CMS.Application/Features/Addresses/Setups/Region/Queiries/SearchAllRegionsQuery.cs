using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.Region.Queiries
{
    public record SearchAllRegionsQuery : IRequest<List<RegionDto>>;
    internal class SearchAllRegionsQueryHandler : IRequestHandler<SearchAllRegionsQuery, List<RegionDto>>
    {
        private readonly IDataService dataService;

        public SearchAllRegionsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<RegionDto>> Handle(SearchAllRegionsQuery request, CancellationToken cancellationToken)
        {
            var jobRoleCategories = await dataService.Regions.ToListAsync(cancellationToken);
            // Map business units to DTOs
            return jobRoleCategories.Select(region => new RegionDto
            (
                region.Id,
                region.Name,
                region.Description,
                region.ApprovalStatus
            )).ToList();
        }
    }
}
