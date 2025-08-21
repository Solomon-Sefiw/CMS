
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Delegation.Commands.CreateDelegation
{
    public class CreateDelegationCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public int? BusinessUnitId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }

    public class CreateDelegationAssignmentCommandHandler : IRequestHandler<CreateDelegationCommand, int>
    {
        private readonly IDataService dataService;

        public CreateDelegationAssignmentCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(CreateDelegationCommand request, CancellationToken cancellationToken)
        {
            
            var delegation = new Domain.Delegations.Delegation
            {
                EmployeeId = request.EmployeeId,
                JobRoleId = request.JobRoleId,
                BusinessUnitId = request.BusinessUnitId,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            dataService.Delegations.Add(delegation);
            await dataService.SaveAsync(cancellationToken);

            return delegation.Id;

        }
    }
}
