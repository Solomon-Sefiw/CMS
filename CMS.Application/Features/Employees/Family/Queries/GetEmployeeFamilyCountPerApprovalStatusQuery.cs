using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


public record GetEmployeeFamilyCountPerApprovalStatusQuery() : IRequest<EmployeeFamilyCountsByStatus>;
public record EmployeeFamilyCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetEmployeeCountPerApprovalStatusQueryHandler : IRequestHandler<GetEmployeeFamilyCountPerApprovalStatusQuery, EmployeeFamilyCountsByStatus>
{
    private readonly IDataService dataService;

    public GetEmployeeCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<EmployeeFamilyCountsByStatus> Handle(GetEmployeeFamilyCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.EmployeeFamilies.Where(EC=> EC.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
        var approvalRequests = await dataService.EmployeeFamilies.Where(EC => EC.ApprovalStatus==ApprovalStatus.Submitted).CountAsync();
        var rejected = await dataService.EmployeeFamilies.Where(EC => EC.ApprovalStatus==ApprovalStatus.Rejected).CountAsync();
        var draft = await dataService.EmployeeFamilies.Where(EC => EC.ApprovalStatus==ApprovalStatus.Draft).CountAsync();
        return new(approved, approvalRequests, rejected, draft);
    }
}
