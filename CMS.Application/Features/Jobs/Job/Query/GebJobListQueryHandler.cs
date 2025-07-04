using AutoMapper;
using Azure.Core;
using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public class GetAllJobQueryHandler : IRequestHandler<GetAllJobQuery, List<JobDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        public GetAllJobQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<JobDto>> Handle(GetAllJobQuery query, CancellationToken cancellation)
        {
            var jobList = await dataService.Jobs.ToListAsync();
            var jobTitleList = await dataService.JobRoles.ToListAsync();
            var businessUnitList = await dataService.BusinessUnits.ToListAsync();
            var modifiedJobList = new List<JobDto>();
            foreach (var job in jobList)
            {
                var jobTitle = jobTitleList.Where(jt => jt.Id == job.JobRoleId).FirstOrDefault();
                var businessUnit = businessUnitList.Where(bu => bu.Id == job.BusinessUnitId).FirstOrDefault();


                //var job = _dataService.Jobs.Where(j => j.Id == request.Id).FirstOrDefault();
                //var businessUnit = await _dataService.BusinessUnits.FirstOrDefaultAsync(bu => bu.Id == job.BusinessUnitId, cancellationToken);

                var jobCount = await dataService.Jobs
                    .CountAsync(job => job.BusinessUnitId == job.BusinessUnitId);
                bool jobCountExceeded = jobCount >= businessUnit.StaffStrength;


                var newJob = new JobDto()
                {
                    Id = job.Id,
                    JobRole = jobTitle.RoleName,
                    BusinessUnit = businessUnit.Name,
                    Vacant = job.IsVacant.ToString(),
                    BusinessUnitId= job.BusinessUnitId,
                    IsVacant=job.IsVacant,
                    Locked=job.IsLocked.ToString(),
                    ApprovalStatus = job.ApprovalStatus,
                    JobStatus = job.JobStatus,
                    IsJobCountExceed=jobCountExceeded,

                };
                modifiedJobList.Add(newJob);
            }
            return modifiedJobList;
        }
    }
}
