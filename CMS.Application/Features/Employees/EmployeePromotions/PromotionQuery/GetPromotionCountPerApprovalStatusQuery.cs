using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetPromotionCountPerApprovalStatusQuery() : IRequest<PromotionCountsByStatus>;
public record PromotionCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetPromotionCountPerApprovalStatusQueryHandler : IRequestHandler<GetPromotionCountPerApprovalStatusQuery, PromotionCountsByStatus>
{
    private readonly IDataService dataService;

    public GetPromotionCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<PromotionCountsByStatus> Handle(GetPromotionCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.EmployeePromotions.Where(JR=>JR.TransactionStatus == EmployeeTransactionStatus.Approved).CountAsync();
        var approvalRequests = await dataService.EmployeePromotions.Where(JR=>JR.TransactionStatus == EmployeeTransactionStatus.Submitted).CountAsync();
        var rejected = await dataService.EmployeePromotions.Where(JR=>JR.TransactionStatus == EmployeeTransactionStatus.Rejected).CountAsync();
        var draft = await dataService.EmployeePromotions.Where(bu=>bu.TransactionStatus == EmployeeTransactionStatus.Draft).CountAsync();
        return new(approved, approvalRequests, rejected, draft);
    }
}
