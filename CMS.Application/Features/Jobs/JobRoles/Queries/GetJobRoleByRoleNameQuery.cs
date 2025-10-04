
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CMS.Application.Features.Jobs.JobRoles.Models;
using CMS.Domain;

namespace CMS.Application.Features.Jobs.JobRoles.Queries
{
    public record GetJobRoleByRoleNameQuery(string rolename) : IRequest<List<JobRoleDto>>;

    public class GetJobRoleByRoleNameQueryHandler : IRequestHandler<GetJobRoleByRoleNameQuery, List<JobRoleDto>>
    {
        private readonly IDataService dataservice;

        public GetJobRoleByRoleNameQueryHandler(IDataService service)
        {
            this.dataservice = service;
        }
        public async Task<List<JobRoleDto>> Handle(GetJobRoleByRoleNameQuery query, CancellationToken token)
        {
            var jobRoles = await dataservice.JobRoles
                .Include(j => j.JobCatagory) // fixed spelling
                .Include(j => j.JobGrade)
                .Include(j => j.JobRoleCategory)
                .Where(j => j.RoleName.ToLower().Contains(query.rolename.ToLower()))
                .ToListAsync(token);

           // if (jobRoles == null || !jobRoles.Any())
             //   throw new Exception("No matching Job Roles found.");

            var result = jobRoles.Select(jobRole => new JobRoleDto
            {
                Id = jobRole.Id,
                RoleName = jobRole.RoleName,
                Description = jobRole.Description,
                JobCatagory = jobRole.JobCatagory.JobCategoryName, // fixed spelling
                JobGrade = jobRole.JobGrade.JobGradeRomanId,
                JobRoleCatagory = jobRole.JobRoleCategory.Name,
                ApprovalStatus = jobRole.ApprovalStatus,
                IsActive = jobRole.IsActive
            }).ToList();
           
            return result;
        }



    }
}



