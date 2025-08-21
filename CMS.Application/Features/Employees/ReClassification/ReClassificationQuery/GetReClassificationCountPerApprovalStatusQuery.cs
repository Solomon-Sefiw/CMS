using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationQuery
{

    public record GetReClassificationCountPerApprovalStatusQuery() : IRequest<ReClassificationCountsByStatus>;
    public record ReClassificationCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public class GetReClassificationCountPerApprovalStatusQueryHandler : IRequestHandler<GetReClassificationCountPerApprovalStatusQuery, ReClassificationCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetReClassificationCountPerApprovalStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ReClassificationCountsByStatus> Handle(GetReClassificationCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeReClassifications.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Approved).CountAsync();
            var approvalRequests = await dataService.EmployeeReClassifications.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Submitted).CountAsync();
            var rejected = await dataService.EmployeeReClassifications.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Rejected).CountAsync();
            var draft = await dataService.EmployeeReClassifications.Where(bu => bu.TransactionStatus == EmployeeTransactionStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}