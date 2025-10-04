using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.RejectSuspension
{
    public record RejectSuspensionCommand(int Id) : IRequest<int>;

    public class RejectSuspensionCommandHandler : IRequestHandler<RejectSuspensionCommand, int>
    {
        private readonly IDataService dataService;

        public RejectSuspensionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(RejectSuspensionCommand command, CancellationToken cancellationToken)
        {
            var suspension = await dataService.Suspensions.FindAsync(command.Id);
            suspension.SkipStateTransitionCheck = true;
            suspension.ApprovalStatus = ApprovalStatus.Rejected;
            suspension.IsActive = false;
            await dataService.SaveAsync(cancellationToken);
            return suspension.Id;
        }
    }
}
