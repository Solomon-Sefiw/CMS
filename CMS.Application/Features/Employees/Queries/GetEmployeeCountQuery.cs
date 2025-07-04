

using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;
//public record GetEmployeeCount(int employees);
public record EmployeeCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
public record GetEmployeeCountQuery(int? businessUnitId) : IRequest<EmployeeCountsByStatus>;

public class GetEmployeeCountQueryHandler : IRequestHandler<GetEmployeeCountQuery, EmployeeCountsByStatus>
{
    private readonly IDataService dataService;

    public GetEmployeeCountQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<EmployeeCountsByStatus> Handle(GetEmployeeCountQuery request, CancellationToken cancellationToken)
    {

        if (request.businessUnitId > 1)
        {
            // employees = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId).CountAsync();
            var approved = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId && e.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId && e.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId && e.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId && e.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }

        else if (request.businessUnitId == 1)

        {
            var approved = await dataService.Employees.Where(e => e.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await dataService.Employees.Where(e => e.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await dataService.Employees.Where(e => e.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await dataService.Employees.Where(e => e.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
        else { return new(0, 0, 0, 0); }

    }
}
