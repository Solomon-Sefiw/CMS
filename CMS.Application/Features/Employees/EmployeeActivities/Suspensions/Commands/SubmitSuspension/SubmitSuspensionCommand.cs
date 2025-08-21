using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.SubmitSuspension
{
    public record SubmitSuspensionCommand(int Id) : IRequest<int>;

    public class SubmitSuspensionCommandHandler : IRequestHandler<SubmitSuspensionCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitSuspensionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(SubmitSuspensionCommand command, CancellationToken cancellationToken)
        {
            var suspension = await dataService.Suspensions.FindAsync(command.Id);
            suspension.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return suspension.Id;
        }
    }
}
