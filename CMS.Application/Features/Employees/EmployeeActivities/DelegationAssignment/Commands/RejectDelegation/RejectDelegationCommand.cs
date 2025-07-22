using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.RejectDelegation
{
    public record RejectDelegationCommand(int Id) : IRequest<int>;
    public class RejectDelegationCommandHandler : IRequestHandler<RejectDelegationCommand, int>
    {
        private readonly IDataService dataService;
        public RejectDelegationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectDelegationCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Delegations.Where(r => r.Id == command.Id).FirstOrDefault();
            if (delegation == null)
            {
                throw new NotFoundException($"Delegation with ID {command.Id} not found.");
            }
            delegation.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return delegation.Id;
        }
    }
}
