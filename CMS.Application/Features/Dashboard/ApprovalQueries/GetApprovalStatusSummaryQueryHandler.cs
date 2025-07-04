using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.ApprovalQueries
{
    public class GetApprovalStatusSummaryQueryHandler
      : IRequestHandler<GetApprovalStatusSummaryQuery, List<ApprovalStatusSummaryDto>>
    {
        private readonly IDataService _dataService;

        public GetApprovalStatusSummaryQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<ApprovalStatusSummaryDto>> Handle(GetApprovalStatusSummaryQuery request,CancellationToken cancellationToken)
        
        {
            var jobCounts = _dataService.Jobs
                .GroupBy(j => j.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var unitCounts = _dataService.BusinessUnits
                .GroupBy(b => b.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var jobRoleCounts = _dataService.JobRoles
                .GroupBy(b => b.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var jobRoleCatagoryCounts = _dataService.JobRoleCatagories
           .GroupBy(b => b.ApprovalStatus)
           .Select(g => new { g.Key, Count = g.Count() });

            var unitPriceCounts = _dataService.BenefitUnitPrices
                .GroupBy(b => b.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var benefitValueCounts = _dataService.BenefitValues
                .GroupBy(b => b.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var benefitCounts = _dataService.Benefits
              .GroupBy(b => b.ApprovalStatus)
              .Select(g => new { g.Key, Count = g.Count() });

            var subcityCounts = _dataService.SubCities
                 .GroupBy(b => b.ApprovalStatus)
                 .Select(g => new { g.Key, Count = g.Count() });

            var institiutionCounts = _dataService.InstitutionNames
              .GroupBy(b => b.ApprovalStatus)
              .Select(g => new { g.Key, Count = g.Count() });

            var awardCounts = _dataService.Awards
             .GroupBy(b => b.ApprovalStatus)
             .Select(g => new { g.Key, Count = g.Count() });

            var educationLevelCounts = _dataService.EducationLevels
             .GroupBy(b => b.ApprovalStatus)
             .Select(g => new { g.Key, Count = g.Count() });

            var employeeCounts = _dataService.Employees
                .GroupBy(e => e.ApprovalStatus)
                .Select(g => new { g.Key, Count = g.Count() });

            var combinedCounts = await jobCounts
                .Concat(unitCounts)
                .Concat(jobRoleCounts)
                .Concat(unitPriceCounts)
                .Concat(jobRoleCatagoryCounts)
                .Concat(benefitValueCounts)
                .Concat(benefitCounts)
                .Concat(subcityCounts)
                .Concat(institiutionCounts)
                .Concat(awardCounts)
                .Concat(educationLevelCounts)
                .Concat(employeeCounts)
                .GroupBy(x => x.Key)
                .Select(g => new ApprovalStatusSummaryDto(g.Key, g.Sum(x => x.Count)))
                .ToListAsync(cancellationToken);

            var allStatuses = Enum.GetValues<ApprovalStatus>();

            var result = allStatuses
                .Select(status => combinedCounts
                    .FirstOrDefault(c => c.Status == status)
                    ?? new ApprovalStatusSummaryDto(status, 0))
                .ToList();

            return result;
        }
    }

}
