
using CMS.Application.Exceptions;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.ApproveDelegation
{
    public record ApproveDelegationCommand(int Id) : IRequest<int>;
    public class ApproveDelegationCommandHandler : IRequestHandler<ApproveDelegationCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveDelegationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveDelegationCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Delegations.Where(r => r.Id == command.Id).FirstOrDefault();

            delegation.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return delegation.Id;
        }
    }
}
