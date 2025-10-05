using CMS.Application.Features.Reemployments.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Reemployments.Queries
{
    public class GetAllReemploymentsQueryHandler : IRequestHandler<GetAllReemploymentsQuery, List<ReemploymentDto>>
    {
        private readonly IDataService _dataService;

        public GetAllReemploymentsQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<ReemploymentDto>> Handle(GetAllReemploymentsQuery request, CancellationToken cancellationToken)
        {
            var reemployments = await _dataService.Reemployments
                    .Include(r => r.Employee)
                    .ThenInclude(e => e.BusinessUnits)
                    .Include(r => r.Employee)
                    .ThenInclude(e => e.Job)
                    .ThenInclude(j => j.JobRole)
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

            return reemployments;
        }
    }
}
