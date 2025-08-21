using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.RejectEmployeeWarning
{
    public record RejectEmployeeWarningCommand(int Id) : IRequest<int>;
    public class RejectEmployeeWarningCommandHandler : IRequestHandler<RejectEmployeeWarningCommand, int>
    {
        private readonly IDataService dataService;
        public RejectEmployeeWarningCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectEmployeeWarningCommand command, CancellationToken cancellationToken)
        {
            var warning = await dataService.EmployeeWarnings.FindAsync(command.Id);
            warning.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return warning.Id;
        }
    }
}
