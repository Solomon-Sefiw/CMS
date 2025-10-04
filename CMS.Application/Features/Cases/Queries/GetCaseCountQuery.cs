

using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;
//public record GetEmployeeCount(int employees);
public record CaseCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
public record GetCaseCountQuery() : IRequest<CaseCountsByStatus>;

public class GetCaseCountQueryHandler : IRequestHandler<GetCaseCountQuery, CaseCountsByStatus>
{
    private readonly IDataService dataService;

    public GetCaseCountQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<CaseCountsByStatus> Handle(GetCaseCountQuery request, CancellationToken cancellationToken)
    {


            // employees = await dataService.Employees.Where(e => e.BusinessUnitID == request.businessUnitId).CountAsync();
            var approved = await dataService.Cases.Where(e =>  e.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await dataService.Cases.Where(e => e.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await dataService.Cases.Where(e => e.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await dataService.Cases.Where(e => e.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);

    }
}
