using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.UpdateSuspension
{
    public class UpdateSuspensionCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public decimal Salary { get; set; }
        public SuspensionReason Reason { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ConditionsForReinstatement { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateSuspensionCommandHandler : IRequestHandler<UpdateSuspensionCommand, int>
    {
        private readonly IDataService dataService;
        public UpdateSuspensionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(UpdateSuspensionCommand command, CancellationToken cancellationToken)
        {
            var suspension = await dataService.Suspensions.FindAsync(command.Id);
            suspension.EmployeeId = command.EmployeeId;
            suspension.StartDate = command.StartDate;
            suspension.EndDate = command.EndDate;
            suspension.Salary = command.Salary;
            suspension.Reason = command.Reason;
            suspension.Description = command.Description;
            suspension.ConditionsForReinstatement = command.ConditionsForReinstatement;
            suspension.IsActive = true;
            suspension.ApprovalStatus = ApprovalStatus.Draft;
            await dataService.SaveAsync(cancellationToken);
            return suspension.Id;
        }
    }
}
