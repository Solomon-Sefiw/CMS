using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.Probation
{
    public class AllEmployeeApproveCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }

    }
    public class AllEmployeeProbationApproveCommandHandler : IRequestHandler<AllEmployeeApproveCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public AllEmployeeProbationApproveCommandHandler(IDataService dataService ,IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;

        }
      public async Task<int> Handle(AllEmployeeApproveCommand request, CancellationToken cancellationToken)
        {
            var employee =await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeStatus = EmployeeStatusEnum.Active;
            employee.ProbationResult = ProbationResult.BecomePermanent;
            employee.ApprovalStatus = ApprovalStatus.Approved;
            employee.SkipStateTransitionCheck = true;
            await dataService.SaveAsync(cancellationToken);
            return employee.EmployeeId;
        }
    }
}