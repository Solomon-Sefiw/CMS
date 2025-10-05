using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementQuery
{

    public record GetSalaryIncrementCountPerApprovalStatusQuery() : IRequest<SalaryIncrementCountsByStatus>;
    public record SalaryIncrementCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public class GetReClassificationCountPerApprovalStatusQueryHandler : IRequestHandler<GetSalaryIncrementCountPerApprovalStatusQuery, SalaryIncrementCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetReClassificationCountPerApprovalStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<SalaryIncrementCountsByStatus> Handle(GetSalaryIncrementCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeSalaryIncrements.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Approved).CountAsync();
            var approvalRequests = await dataService.EmployeeSalaryIncrements.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Submitted).CountAsync();
            var rejected = await dataService.EmployeeSalaryIncrements.Where(JR => JR.TransactionStatus == EmployeeTransactionStatus.Rejected).CountAsync();
            var draft = await dataService.EmployeeSalaryIncrements.Where(bu => bu.TransactionStatus == EmployeeTransactionStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}