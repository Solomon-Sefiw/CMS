using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeID
{
    public class EmployeeIDCardReplaceCommand : IRequest<int>
    {

        public int EmployeeId { get; set; }
        public EmployeeIDCardStatus? status { get; set; }
        public EmployeeIDCardReplaceReason? reason { get; set; }

        public string? EmployeeIdCardStatusRemark { get; set; }

    }
    public class EmployeeIDCardReplaceCommandHandler : IRequestHandler<EmployeeIDCardReplaceCommand, int>
    {
        private readonly IDataService dataService;
        public EmployeeIDCardReplaceCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;

        }

        public async Task<int> Handle(EmployeeIDCardReplaceCommand request, CancellationToken cancellationToken)
        {

            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeIDCardStatus = EmployeeIDCardStatus.IDNotGiven;
            employee.SkipStateTransitionCheck = true;
            employee.IDReplaceReason = request.reason;
            employee.EmployeeIdCardStatusRemark = request.EmployeeIdCardStatusRemark;
            await dataService.SaveAsync(cancellationToken);
            return employee.Id;
        }
    }
}