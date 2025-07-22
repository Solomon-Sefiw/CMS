using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.UpdateDelegation
{
   public class UpdateDelegationCommands : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public int? BusinessUnitId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }

    public class UpdateDelegationCommandHandler : IRequestHandler<UpdateDelegationCommands, int>
    {
        private readonly IDataService dataService;

        public UpdateDelegationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateDelegationCommands request, CancellationToken cancellationToken)
        {
            var delegation = await dataService.Delegations.FindAsync(request.Id);
            if (delegation == null)
            {
                throw new NotFoundException($"Delegation with ID {request.Id} not found.");
            }

            delegation.EmployeeId = request.EmployeeId;
            delegation.JobRoleId = request.JobRoleId;
            delegation.BusinessUnitId = request.BusinessUnitId;
            delegation.StartDate = request.StartDate;
            delegation.EndDate = request.EndDate;
            delegation.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await dataService.SaveAsync(cancellationToken);

            return delegation.Id;
        }
    }

}
