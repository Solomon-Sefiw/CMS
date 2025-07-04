using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeID
{
    public class EmployeeIDCardGivenCommand : IRequest<int>
    {

        public int EmployeeId { get; set; }
        public EmployeeIDCardStatus status { get; set; }
        public string? EmployeeIdCardStatusRemark { get; set; }
    }
    public class EmployeeIDCardGivenCommandHandler : IRequestHandler<EmployeeIDCardGivenCommand, int>
    {
        private readonly IDataService dataService;
        public EmployeeIDCardGivenCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;

        }
        public async Task<int> Handle(EmployeeIDCardGivenCommand request, CancellationToken cancellationToken)
        {
            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeIDCardStatus = EmployeeIDCardStatus.IDGiven;
            employee.SkipStateTransitionCheck = true;
            employee.EmployeeIdCardStatusRemark = request.EmployeeIdCardStatusRemark;
            await dataService.SaveAsync(cancellationToken);
            return employee.EmployeeId;
        }
    }
}