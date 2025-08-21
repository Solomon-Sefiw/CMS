using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.Probation
{
    public class ProbationSubmitToApproverCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public ProbationResult ProbationResult { get; set; }
        public string? ProbationRemark { get; set; }

    }
    public class ProbationSubmitToApproverCommandHandler : IRequestHandler<ProbationSubmitToApproverCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public ProbationSubmitToApproverCommandHandler(IDataService dataService ,IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;

        }

        public async Task<int> Handle(ProbationSubmitToApproverCommand request, CancellationToken cancellationToken)
        {

            var employee = await dataService.Employees.FindAsync(request.EmployeeId);
            employee.EmployeeStatus = EmployeeStatusEnum.ProbationApprovalRequest;
            employee.ProbationResult = request.ProbationResult;
            employee.ProbationRemark = request.ProbationRemark;
            employee.ApprovalStatus = ApprovalStatus.Approved;
            employee.SkipStateTransitionCheck = true;
            await dataService.SaveAsync(cancellationToken);
            return employee.Id;
        }
    }
}