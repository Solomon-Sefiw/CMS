using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetBusinessUnitCountPerApprovalStatusQuery() : IRequest<BusinessUnitCountsByStatus>;
public record BusinessUnitCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetBusinessUnitCountPerApprovalStatusQueryHandler : IRequestHandler<GetBusinessUnitCountPerApprovalStatusQuery, BusinessUnitCountsByStatus>
{
    private readonly IDataService dataService;

    public GetBusinessUnitCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<BusinessUnitCountsByStatus> Handle(GetBusinessUnitCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.BusinessUnits.Where(bu=>bu.ApprovalStatus==ApprovalStatus.Approved).CountAsync();
        var approvalRequests = await dataService.BusinessUnits.Where(bu=>bu.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
        var rejected = await dataService.BusinessUnits.Where(bu => bu.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
        var draft = await dataService.BusinessUnits.Where(bu=>bu.ApprovalStatus == ApprovalStatus.Draft).CountAsync();

        return new(approved, approvalRequests, rejected, draft);
    }
}
