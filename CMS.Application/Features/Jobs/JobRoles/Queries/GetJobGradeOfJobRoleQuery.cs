
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
    public record GetJobGradeOfJobRoleQuery(int roleid) : IRequest<JobRole>;

    public class GetJobGradeOfJobRoleQueryHandler : IRequestHandler<GetJobGradeOfJobRoleQuery, JobRole>
    {
        private readonly IDataService dataservice;

        public GetJobGradeOfJobRoleQueryHandler(IDataService service)
        {
            this.dataservice = service;
        }
        public async Task<JobRole> Handle(GetJobGradeOfJobRoleQuery query, CancellationToken token)
        {
            var jobRoles = await dataservice.JobRoles
                .Include(j => j.JobCatagory) // fixed spelling
                .Include(j => j.JobGrade).ThenInclude(stp=>stp.Steps)
                .Include(j => j.JobRoleCategory)
                   .FirstOrDefaultAsync(j => j.Id == query.roleid); // assuming Id is the PK

           
            return jobRoles;
        }



    }
}



