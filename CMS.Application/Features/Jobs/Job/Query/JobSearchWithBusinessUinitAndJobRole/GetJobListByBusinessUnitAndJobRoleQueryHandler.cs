using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace CMS.Application.Features.Jobs.Job.Query.JobSearchWithBusinessUinitAndJobRole
{
    public class GetJobListByBusinessUnitAndJobRoleQueryHandler : IRequestHandler<GetJobListByBusinessUnitAndJobRoleQuery, JobSearchResultByBusinessUnitAndJobRole>
    {
        private readonly IDataService _dataService;

        public GetJobListByBusinessUnitAndJobRoleQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<JobSearchResultByBusinessUnitAndJobRole> Handle(GetJobListByBusinessUnitAndJobRoleQuery request, CancellationToken cancellationToken)
        {
            if (request.PageNumber <= 0 || request.PageSize <= 0)
                throw new ArgumentException("PageNumber and PageSize must be greater than 0.");

            var businessUnits = await _dataService.BusinessUnits.ToListAsync(cancellationToken);
            var jobRoles = await _dataService.JobRoles.ToListAsync(cancellationToken);

            var filteredBusinessUnitIds = request.businessUnit > 0
                ? businessUnits.Where(j => j.Id == request.businessUnit).Select(j => j.Id)
                : businessUnits.Select(j => j.Id);

            var filteredJobRoleIds = request.jobRole > 0
                ? jobRoles.Where(j => j.Id == request.jobRole).Select(j => j.Id)
                : jobRoles.Select(j => j.Id);

            var query = _dataService.Jobs
                .Where(j => filteredBusinessUnitIds.Contains(j.BusinessUnitId)
                            && filteredJobRoleIds.Contains(j.JobRoleId));

            var totalRecords = await query.CountAsync(cancellationToken);
            var jobList = await query.Skip((request.PageNumber - 1) * request.PageSize)
                                     .Take(request.PageSize)
                                     .ToListAsync(cancellationToken);

            var jobDtoList = jobList.Select(job =>
            {
                var businessUnit = businessUnits.FirstOrDefault(b => b.Id == job.BusinessUnitId);
                var jobRole = jobRoles.FirstOrDefault(r => r.Id == job.JobRoleId);

                return new JobDto
                {
                    Id = job.Id,
                    JobRoleId = job.JobRoleId,
                    BusinessUnitId = job.BusinessUnitId,
                    IsVacant = job.IsVacant,
                    BusinessUnit = businessUnit?.Name,
                    JobRole = jobRole?.RoleName,
                    Vacant = job.IsVacant ? "Yes" : "No",
                    IsLocked = job.IsLocked,
                    Locked = job.IsLocked ? "Yes" : "No",
                    JobStatus = job.JobStatus,
                    ApprovalStatus = job.ApprovalStatus,
                };
            }).ToList();

            return new JobSearchResultByBusinessUnitAndJobRole(jobDtoList, totalRecords);
        }
    }
}
