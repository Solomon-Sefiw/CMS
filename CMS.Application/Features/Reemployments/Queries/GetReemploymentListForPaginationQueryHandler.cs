using CMS.Application.Features.Reemployments.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Reemployments.Queries
{
    public class GetReemploymentListForPaginationQueryHandler
        : IRequestHandler<GetReemploymentListForPaginationQuery, ReemploymentSearchResult>
    {
        private readonly IDataService _dataService;

        public GetReemploymentListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<ReemploymentSearchResult> Handle(GetReemploymentListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Reemployments
                .Include(r => r.Employee)
                    .ThenInclude(e => e.BusinessUnits)
                .Include(r => r.Employee)
                    .ThenInclude(e => e.Job)
                        .ThenInclude(j => j.JobRole)
                .Where(r => r.ApprovalStatus == request.Status && r.EmployeeId==request.employeeId)
                .AsQueryable();

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(r => r.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new ReemploymentDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.DisplayName,
                    BusinessUnitName = r.Employee.BusinessUnits.Name,
                    JobRoleName = r.Employee.Job.JobRole.RoleName,
                    ReemploymentType = r.ReemploymentType,
                    ApprovalStatus = r.ApprovalStatus,
                    ReemploymentDate = r.ReemploymnetDate,
                    ReasonForReemployment = r.ReasonForReemploymnet,
                    Remark = r.Remark
                })
                .ToListAsync(cancellationToken);

            return new ReemploymentSearchResult(items, totalCount);
        }
    }
}
