using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.Region.Queiries
{
    public class GetAllRegionsQueryHandler : IRequestHandler<GetAllRegionsQuery ,RegionLists>
    {
        private readonly IDataService dataService;

        public GetAllRegionsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<RegionLists> Handle(GetAllRegionsQuery query, CancellationToken cancellationToken)
        {
            var regions = await dataService.Regions
                .Include(r => r.SubCities)
                .ToListAsync(cancellationToken);

            var regionList = regions.Select(region => new RegionDto(
                region.Id,
                region.Name,
                region.Description,
                region.ApprovalStatus
               // region.SubCities.Select(sc => new SubCityDto(sc.Id, sc.Name))
            ));
            var approved = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new RegionLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );


        }
    }

}
