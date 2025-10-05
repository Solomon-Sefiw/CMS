using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Application.Features.Jobs.JobRoles.Models;
using CMS.Application.Features.Jobs.JobRoles.Queries;
using CMS.Domain;
using CMS.Domain.Jobs;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public record GetJobByBusinessUnitIDQuery(int ID, int employeeID) : IRequest<List<JobDto>>;

    public class GetJobByBusinessUnitIDQueryHandler : IRequestHandler<GetJobByBusinessUnitIDQuery, List<JobDto>>
    {
        private readonly IDataService dataservice;

        public GetJobByBusinessUnitIDQueryHandler(IDataService service)
        {
            this.dataservice = service;
        }
        public async Task<List<JobDto>> Handle(GetJobByBusinessUnitIDQuery query, CancellationToken token)
        {
            var employeeJobRole = await dataservice.Employees.Where(a => a.Id == query.employeeID).Include(a => a.Job).FirstOrDefaultAsync();
            var availableJob = new List<CMS.Domain.Jobs.Job>();
            if (employeeJobRole != null)
            {
                var occopied = await dataservice.Jobs.Where(a => a.BusinessUnitId == query.ID && a.IsVacant == false)
                    .Include(a => a.JobRole).Include(a => a.BusinessUnit).ToListAsync();
                var vacant = await dataservice.Jobs.Where(a => a.BusinessUnitId == query.ID
              && a.IsVacant == true).Include(a => a.JobRole).Include(a => a.BusinessUnit).ToListAsync();
                availableJob.AddRange(occopied.Concat(vacant));
            }
            else
            {

                availableJob = await dataservice.Jobs.Where(a => a.BusinessUnitId == query.ID
               && a.IsVacant == true).Include(a => a.JobRole).Include(a => a.BusinessUnit).ToListAsync();
            }
            var modifiedJobList = new List<JobDto>();

            foreach (var job in availableJob)
            {

                var jobCount = await dataservice.Jobs
                   .CountAsync(j => j.BusinessUnitId == job.BusinessUnitId);
                bool jobCountExceeded = jobCount >= job.BusinessUnit.StaffStrength;

                var newJob = new JobDto()
                {
                    Id = job.Id,
                    JobRole = job.JobRole.RoleName,
                    BusinessUnit = job.BusinessUnit.Name,
                    Vacant = job.IsVacant.ToString(),
                    BusinessUnitId = job.BusinessUnitId,
                    IsVacant = job.IsVacant,
                    Locked = job.IsLocked.ToString(),
                    ApprovalStatus = job.ApprovalStatus,
                    JobStatus = job.JobStatus,
                    IsJobCountExceed = jobCountExceeded,
                    //
                    JobRoleId = job.JobRoleId,
                    //

                };
                modifiedJobList.Add(newJob);
            }
            return modifiedJobList;

        }
    }
}
