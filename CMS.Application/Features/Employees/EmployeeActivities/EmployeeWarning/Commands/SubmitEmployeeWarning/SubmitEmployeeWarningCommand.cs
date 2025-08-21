using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.SubmitEmployeeWarning
{
    public record SubmitEmployeeWarningCommand(int Id) : IRequest<int>;

    public class SubmitEmployeeWarningCommandHandler : IRequestHandler<SubmitEmployeeWarningCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitEmployeeWarningCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(SubmitEmployeeWarningCommand command, CancellationToken cancellationToken)
        {
            var warning = await dataService.EmployeeWarnings.FindAsync(command.Id);

            warning.ApprovalStatus = ApprovalStatus.Submitted;

            await dataService.SaveAsync(cancellationToken);
            return warning.Id;
        }
    }
}
