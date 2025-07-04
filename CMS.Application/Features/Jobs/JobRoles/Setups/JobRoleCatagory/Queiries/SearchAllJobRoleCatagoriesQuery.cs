using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries
{
    public record SearchAllJobRoleCatagoriesQuery : IRequest<List<JobRoleCatagoryDto>>;
    internal class SearchAllJobRoleCatagoriesQueryHandler : IRequestHandler<SearchAllJobRoleCatagoriesQuery, List<JobRoleCatagoryDto>>
    {
        private readonly IDataService dataService;

        public SearchAllJobRoleCatagoriesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<JobRoleCatagoryDto>> Handle(SearchAllJobRoleCatagoriesQuery request, CancellationToken cancellationToken)
        {
            var jobRoleCategories = await dataService.JobRoleCatagories.ToListAsync(cancellationToken);
            // Map business units to DTOs
            return jobRoleCategories.Select(jobRoleCat => new JobRoleCatagoryDto
            (
                Id: jobRoleCat.Id,
                Name: jobRoleCat.Name,
                Description: jobRoleCat.Description,
                ApprovalStatus: jobRoleCat.ApprovalStatus
            )).ToList();
        }
    }
}
