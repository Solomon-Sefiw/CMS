using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.RemoveDeligation
{
    public record RemoveDeligationCommand(int Id) : IRequest<int>;

    public class RemoveDeligationCommandHandler : IRequestHandler<RemoveDeligationCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;

        public RemoveDeligationCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }
        public async Task<int> Handle(RemoveDeligationCommand command, CancellationToken cancellationToken)
        {


            var delegation = dataService.Delegations
            .Include(d => d.Employee)
            .Include(d => d.JobRole)
            .Include(d => d.BusinessUnit).Where(r => r.Id == command.Id).FirstOrDefault();
            var address = dataService.Addresses
                      .Where(a => a.RequestId == delegation.BusinessUnitId && a.AddressType == AddressTypeEnum.BusinessUnitAddress).FirstOrDefault();
            delegation.EndDate = DateOnly.FromDateTime(DateTime.Now);
            delegation.IsActive = false;

            // Only add experience if it's a delegation
            if (delegation.EmployeeId != null)
            {
                var experienceCommand = new AddEmployeeExperienceCommand
                {
                    FirmName = "Amhara Court", // Or fetch dynamically
                    StartDate = delegation.StartDate,
                    EndDate = delegation.EndDate.HasValue ? delegation.EndDate.Value : null,
                    JobTitle = delegation.JobRole.RoleName,
                    City = address.City ?? "N/A", // Or fetch based on org or employee
                    LastSalary = 1234,
                    ReasonForResignation = "Delegation Assigned",
                    ExperienceType = ExperienceType.Delegation,
                    EmployeeId = delegation.EmployeeId
                };

                await mediator.Send(experienceCommand, cancellationToken);
            }
            await dataService.SaveAsync(cancellationToken);

            return delegation.Id;
        }
    }
}
