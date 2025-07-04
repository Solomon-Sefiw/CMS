using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Region.Queiries;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries
{
    public class GetAllJobRoleCatagoriesQueryHandler : IRequestHandler<GetAllJobRoleCatagoriesQuery, JobRoleCatagoryLists>
    {
        private readonly IDataService dataService;

        public GetAllJobRoleCatagoriesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<JobRoleCatagoryLists> Handle(GetAllJobRoleCatagoriesQuery query, CancellationToken cancellationToken)
        {
            var jobRoleCategories = await dataService.JobRoleCatagories
                .Include(r => r.JobRoles)
                .ToListAsync(cancellationToken);

            var regionList = jobRoleCategories.Select(region => new JobRoleCatagoryDto(
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


            return new JobRoleCatagoryLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );


        }
    }
}
