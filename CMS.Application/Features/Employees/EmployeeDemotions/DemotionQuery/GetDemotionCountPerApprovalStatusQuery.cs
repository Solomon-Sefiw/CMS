using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.EmployeeDemotions.DemotionQuery
{
    public record GetDemotionCountPerApprovalStatusQuery() : IRequest<DemotionCountsByStatus>;
    public record DemotionCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public class GetDemotionCountPerApprovalStatusQueryHandler : IRequestHandler<GetDemotionCountPerApprovalStatusQuery, DemotionCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetDemotionCountPerApprovalStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<DemotionCountsByStatus> Handle(GetDemotionCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeDemotions.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Approved).CountAsync();
            var approvalRequests = await dataService.EmployeeDemotions.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Submitted).CountAsync();
            var rejected = await dataService.EmployeeDemotions.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Rejected).CountAsync();
            var draft = await dataService.EmployeeDemotions.Where(bu => bu.TransactionStatus == EmployeeTransactionStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}
