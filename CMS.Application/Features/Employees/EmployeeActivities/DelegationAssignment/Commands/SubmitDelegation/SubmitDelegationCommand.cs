using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.SubmitDelegation
{
    public record SubmitDelegationCommand(int Id) : IRequest<int>;

    public class SubmitDelegationCommandHandler : IRequestHandler<SubmitDelegationCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitDelegationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitDelegationCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Delegations.Where(r => r.Id == command.Id).FirstOrDefault();

            delegation.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return delegation.Id;
        }
    }
}
