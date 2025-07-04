using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public class GetJobListForPaginationQueryHandler : IRequestHandler<GetJobListForPaginationQuery, JobSearchResult>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;
        public GetJobListForPaginationQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }
        public async Task<JobSearchResult> Handle(GetJobListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var jobQuery = _dataService.Jobs.AsQueryable();

            jobQuery = jobQuery.Where(j => j.ApprovalStatus == request.Status);
            var jobsPaginated = jobQuery
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize);

            var jobList = await jobsPaginated
            .Include(j => j.BusinessUnit)
            .Include(j => j.JobRole)
            .ToListAsync(cancellationToken);
            var count = await jobQuery.CountAsync(cancellationToken);

            var jobCountByBusinessUnit = jobList
            .GroupBy(j => j.BusinessUnitId)
            .ToDictionary(g => g.Key, g => g.Count());

            var result = jobList.Select(job => new JobDto
            {
                Id = job.Id,
                JobRoleId = job.JobRoleId,
                BusinessUnitId = job.BusinessUnitId,
                IsVacant = job.IsVacant,
                BusinessUnit = job.BusinessUnit.Name,
                JobRole = job.JobRole.RoleName,
                Vacant = job.IsVacant.ToString(),
                IsLocked = job.IsLocked,
                Locked = job.IsLocked.ToString(),
                JobStatus = job.JobStatus,
                ApprovalStatus = job.ApprovalStatus,
                //IsJobCountExceed = jobCountByBusinessUnit[j.BusinessUnitId] >= job.BusinessUnit.StaffStrength,
                IsJobCountExceed = (
                           jobCountByBusinessUnit[job.BusinessUnitId] > job.BusinessUnit.StaffStrength)
            }).ToList();

            return new JobSearchResult(result, count);
        }
    }
}
