using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.RejectActing
{

    public record RejectActingCommand(int Id) : IRequest<int>;

    public class RejectActingCommandHandler : IRequestHandler<RejectActingCommand, int>
    {
        private readonly IDataService dataService;

        public RejectActingCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectActingCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Actings.Where(r => r.Id == command.Id).FirstOrDefault();

            delegation.ApprovalStatus = ApprovalStatus.Rejected;
            delegation.IsActive = false;
            await dataService.SaveAsync(cancellationToken);
            return delegation.Id;
        }
    }
}
