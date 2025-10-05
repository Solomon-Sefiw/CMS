using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeID
{
    public class EmployeeIDCardApprovalApprovalCommand : IRequest<int>
    {

        public int EmployeeId { get; set; }
        public EmployeeIDCardStatus status { get; set; }
        public string ? EmployeeIdCardStatusRemark { get; set; }
    }
    public class EmployeeIDCardApprovalApprovalCommandHandler : IRequestHandler<EmployeeIDCardApprovalApprovalCommand, int>
    {
        private readonly IDataService dataService;
        public EmployeeIDCardApprovalApprovalCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;

        }

        public async Task<int> Handle(EmployeeIDCardApprovalApprovalCommand request, CancellationToken cancellationToken)
        {

            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeIDCardStatus =EmployeeIDCardStatus.IDCardApproved;
            employee.EmployeeIdCardStatusRemark = request.EmployeeIdCardStatusRemark;
            employee.SkipStateTransitionCheck = true;
            await dataService.SaveAsync(cancellationToken);
            return employee.Id;
        }
    }
}