using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Queiries;
using CMS.Application.Features.Addresses.Setups.Region.Queiries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Queiries
{
    public class GetAllSubCitiesQueryHandler : IRequestHandler<GetAllSubCitiesQuery, SubCityLists>
    {
        private readonly IDataService dataService;

        public GetAllSubCitiesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<SubCityLists> Handle(GetAllSubCitiesQuery query, CancellationToken cancellationToken)
        {
            var subCities = await dataService.SubCities
                .Include(sc => sc.Region)
                .ToListAsync(cancellationToken);

            var subCityList =  subCities.Select(subCity => new SubCityDto(
                subCity.Id,
                subCity.Name,
                subCity.Description,
                subCity.RegionId,
            subCity.Region?.Name,
            subCity.ApprovalStatus
            ));

            var approved = subCityList.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = subCityList.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = subCityList.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = subCityList.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new SubCityLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }

}
