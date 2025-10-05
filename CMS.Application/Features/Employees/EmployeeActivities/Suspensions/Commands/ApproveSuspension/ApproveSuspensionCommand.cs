using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.ApproveSuspension
{
    public record ApproveSuspensionCommand(int Id) : IRequest<int>;

    public class ApproveSuspensionCommandHandler : IRequestHandler<ApproveSuspensionCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveSuspensionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(ApproveSuspensionCommand command, CancellationToken cancellationToken)
        {
            var suspension = await dataService.Suspensions.FindAsync(command.Id);
            suspension.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return suspension.Id;
        }
    }
}
