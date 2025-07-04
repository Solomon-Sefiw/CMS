using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeID
{
    public class EmployeeIDCardApprovalRejectedCommand : IRequest<int>
    {

        public int EmployeeId { get; set; }
        public EmployeeIDCardStatus status { get; set; }
        public string? EmployeeIdCardStatusRemark { get; set; }
    }
    public class EmployeeIDCardApprovalRejectedCommandHandler : IRequestHandler<EmployeeIDCardApprovalRejectedCommand, int>
    {
        private readonly IDataService dataService;
        public EmployeeIDCardApprovalRejectedCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;

        }

        public async Task<int> Handle(EmployeeIDCardApprovalRejectedCommand request, CancellationToken cancellationToken)
        {

            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeIDCardStatus = EmployeeIDCardStatus.IDCardApprovalRejected;
            employee.EmployeeIdCardStatusRemark = request.EmployeeIdCardStatusRemark;
            employee.SkipStateTransitionCheck = true;
            await dataService.SaveAsync(cancellationToken);
            return employee.EmployeeId;
        }
    }
}