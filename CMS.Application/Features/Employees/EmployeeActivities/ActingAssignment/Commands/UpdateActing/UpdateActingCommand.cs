using CMS.Application.Exceptions;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.UpdateActing
{

    public class UpdateActingCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public int PreviousJobRoleId { get; set; }
        public int? BusinessUnitId { get; set; }
        public int? PreviousBusinessUnitId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public ActingType ActingType { get; set; }
    }

    public class UpdateActingCommandHandler : IRequestHandler<UpdateActingCommand, int>
    {
        private readonly IDataService dataService;

        public UpdateActingCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateActingCommand request, CancellationToken cancellationToken)
        {
            var delegation = await dataService.Actings.FindAsync(request.Id);
            if (delegation == null)
            {
                throw new NotFoundException($"Delegation with ID {request.Id} not found.");
            }

            delegation.EmployeeId = request.EmployeeId;
            delegation.JobRoleId = request.JobRoleId;
            delegation.PreviousJobRoleId = request.PreviousJobRoleId;
            delegation.BusinessUnitId = request.BusinessUnitId;
            delegation.PreviousBusinessUnitId = request.PreviousJobRoleId;
            delegation.StartDate = request.StartDate;
            delegation.EndDate = request.EndDate;
            delegation.ActingType = request.ActingType;
            delegation.ApprovalStatus = ApprovalStatus.Draft;
            delegation.IsActive = true;

            await dataService.SaveAsync(cancellationToken);

            return delegation.Id;
        }
    }
}
