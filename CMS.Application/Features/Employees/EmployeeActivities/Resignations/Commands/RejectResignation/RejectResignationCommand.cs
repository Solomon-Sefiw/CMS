using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.RejectResignation
{
    public record RejectResignationCommand(int Id) : IRequest<int>;

    public class RejectResignationCommandHandler : IRequestHandler<RejectResignationCommand, int>
    {
        private readonly IDataService dataService;

        public RejectResignationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(RejectResignationCommand command, CancellationToken cancellationToken)
        {
            var resignation = await dataService.Resignations.FindAsync(command.Id);
            resignation.SkipStateTransitionCheck = true;
            resignation.ApprovalStatus = ApprovalStatus.Rejected;
            resignation.IsActive = false;
            await dataService.SaveAsync(cancellationToken);
            return resignation.Id;
        }
    }
}
