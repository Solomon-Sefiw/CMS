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
    public class GetEmployeeDistributionByStatusQueryHandler : IRequestHandler<GetEmployeeDistributionByStatusQuery, List<EmployeeDistributionByStatusDto>>
    {
        private readonly IDataService _dataService;

        public GetEmployeeDistributionByStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<EmployeeDistributionByStatusDto>> Handle(GetEmployeeDistributionByStatusQuery request, CancellationToken cancellationToken)
        {
            var activeCount = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active)
                .CountAsync(cancellationToken);

            var resignedCount = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Resigned)
                .CountAsync(cancellationToken);

            var probationCount = await _dataService.Employees
                            .Where(e =>
                            e.EmployeeStatus == EmployeeStatusEnum.UnderProbation ||
                            e.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRejected ||
                            e.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRequest)
                           .CountAsync(cancellationToken);


            var blockedCount = await _dataService.Employees
                             .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Blocked)
                             .CountAsync(cancellationToken);

            var terminatedCount = await _dataService.Employees
                          .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Terminated)
                          .CountAsync(cancellationToken);

            var reassignedCount = await _dataService.Employees
                         .Where(e => e.EmployeeStatus == EmployeeStatusEnum.ReAssigned)
                         .CountAsync(cancellationToken);

            var otherCount = await _dataService.Employees
                       .Where(e => e.EmployeeStatus != EmployeeStatusEnum.Active &&
                            e.EmployeeStatus != EmployeeStatusEnum.ReAssigned &&
                            e.EmployeeStatus != EmployeeStatusEnum.Terminated &&
                            e.EmployeeStatus != EmployeeStatusEnum.Blocked &&
                            e.EmployeeStatus != EmployeeStatusEnum.Resigned &&
                            e.EmployeeStatus != EmployeeStatusEnum.ProbationApprovalRequest &&
                            e.EmployeeStatus != EmployeeStatusEnum.ProbationApprovalRejected &&
                            e.EmployeeStatus != EmployeeStatusEnum.UnderProbation)
                      .CountAsync(cancellationToken);

            return new List<EmployeeDistributionByStatusDto>
            {
             new("Active Employees", activeCount),
             new("Resigned Employees", resignedCount),
             new("Blocked Employees", blockedCount),
             new("Terminated Employees", terminatedCount),
             new("Reasidned Employees", reassignedCount),
             new("Under Probation Period", probationCount),
             new("Other", otherCount)
            };
        }
    }
}
