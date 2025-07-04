using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeID
{
    public class EmployeeIDCardUpdateCommand : IRequest<int>
    {

        public int EmployeeId { get; set; }
        public EmployeeIDCardStatus status { get; set; }
        public string? EmployeeIdCardStatusRemark { get; set; }
    }
    public class EmployeeIDCardUpdateCommandHandler : IRequestHandler<EmployeeIDCardUpdateCommand, int>
    {
        private readonly IDataService dataService;
        public EmployeeIDCardUpdateCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;

        }
        public async Task<int> Handle(EmployeeIDCardUpdateCommand request, CancellationToken cancellationToken)
        {
            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeIDCardStatus = EmployeeIDCardStatus.IDNotGiven;
            employee.SkipStateTransitionCheck = true;
            employee.EmployeeIdCardStatusRemark = request.EmployeeIdCardStatusRemark;

            await dataService.SaveAsync(cancellationToken);
            return employee.EmployeeId;
        }
    }
}