using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public class GetVacantJobsCountQueryHandler : IRequestHandler<GetVacantJobsCountQuery, VacantJobsCount>
    {
        private readonly IDataService _dataService;

        public GetVacantJobsCountQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<VacantJobsCount> Handle(GetVacantJobsCountQuery request, CancellationToken cancellationToken)
        {
            var totalActiveApprovedJobs = await _dataService.Jobs
                .Where(j => j.JobStatus == JobStatus.Active &&
                            j.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var currentVacantJobs = await _dataService.Jobs
                .Where(j => j.IsVacant &&
                            j.JobStatus == JobStatus.Active &&
                            j.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            string changeLabel;

            if (totalActiveApprovedJobs == 0)
            {
                changeLabel = "N/A";
            }
            else
            {
                double percentVacant = ((double)currentVacantJobs / totalActiveApprovedJobs) * 100;
                changeLabel = $"{percentVacant:0.0}% of total active jobs are vacant";
            }
            return new VacantJobsCount(currentVacantJobs, changeLabel);
        }

    }
}
