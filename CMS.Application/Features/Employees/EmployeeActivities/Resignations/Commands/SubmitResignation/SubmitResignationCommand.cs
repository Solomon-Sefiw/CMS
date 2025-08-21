using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.SubmitResignation
{
    public record SubmitResignationCommand(int Id) : IRequest<int>;

    public class SubmitResignationCommandHandler : IRequestHandler<SubmitResignationCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitResignationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(SubmitResignationCommand command, CancellationToken cancellationToken)
        {
            var resignation = await dataService.Resignations.FindAsync(command.Id);
            resignation.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return resignation.Id;
        }
    }
}
