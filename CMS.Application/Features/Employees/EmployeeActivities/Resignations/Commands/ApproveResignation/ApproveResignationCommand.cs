using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.ApproveResignation
{
    public record ApproveResignationCommand(int Id) : IRequest<int>;

    public class ApproveResignationCommandHandler : IRequestHandler<ApproveResignationCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveResignationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(ApproveResignationCommand command, CancellationToken cancellationToken)
        {
            var resignation = await dataService.Resignations.FindAsync(command.Id);
            resignation.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return resignation.Id;
        }
    }
}
