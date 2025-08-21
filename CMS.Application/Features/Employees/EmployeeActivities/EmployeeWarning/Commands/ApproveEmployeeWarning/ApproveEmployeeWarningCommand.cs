using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.ApproveEmployeeWarning
{
    public record ApproveEmployeeWarningCommand(int Id) : IRequest<int>;
    public class ApproveEmployeeWarningCommandHandler : IRequestHandler<ApproveEmployeeWarningCommand, int>
    {
        private readonly IDataService dataService;
        public ApproveEmployeeWarningCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveEmployeeWarningCommand command, CancellationToken cancellationToken)
        {
            var warning = await dataService.EmployeeWarnings.FindAsync(command.Id);
            warning.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return warning.Id;
        }
    }
}
