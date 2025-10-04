using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Jobs;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.Commands.UpdateEmployee
{
    public class UpdateCaseCommand : IRequest<int>
    {

        public int Id { get; set; }
        public string CaseNumber { get; set; }
        public CaseType CaseType { get; set; }
        public CaseStatus Status { get; set; }
        public string PlaintiffName { get; set; }
        public string AccusedName { get; set; }
        public string? Subject { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string FiledById { get; set; }
        public string? AssignedJudgeId { get; set; }
        public int BusinessUnitId { get; set; }
        public int? ChilotId { get; set; }
    }
    public class UpdateCaseCommandHandler : IRequestHandler<UpdateCaseCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public UpdateCaseCommandHandler(IDataService dataService ,IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;

        }

        public async Task<int> Handle(UpdateCaseCommand request, CancellationToken cancellationToken)
        {

            var employee = dataService.Cases.FirstOrDefault(x => x.Id == request.Id);

                employee.CaseNumber = request.CaseNumber;
                employee.CaseType = request.CaseType;
                employee.Status = request.Status;
                employee.PlaintiffName = request.PlaintiffName ;
                employee.AccusedName = request.AccusedName;
                employee.Subject = request.Subject;
                employee.ClosedAt = request.ClosedAt;
                employee.FiledById = request.FiledById;
                employee.AssignedJudgeId = employee.AssignedJudgeId;
                employee.BusinessUnitId = request.BusinessUnitId;
                employee.ChilotId = request.ChilotId;
                employee.ApprovalStatus = ApprovalStatus.Draft;
            await dataService.SaveAsync(cancellationToken);
            // await employeeChangeLogService.LogEmployeeBasicInfoChange(employee, ChangeType.Modified, cancellationToken);

            return employee.Id;
        }
    }
}