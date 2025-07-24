
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
        private readonly IMediator mediator;

        public ApproveDelegationCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }
        public async Task<int> Handle(ApproveDelegationCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Delegations
                .Include(d => d.Employee)
                .Include(d => d.JobRole)
                .Include(d => d.BusinessUnit).Where(r => r.Id == command.Id).FirstOrDefault();
            var address = dataService.Addresses
                      .Where(a => a.RequestId == delegation.BusinessUnitId && a.AddressType == AddressTypeEnum.BusinessUnitAddress).FirstOrDefault();
            delegation.ApprovalStatus = ApprovalStatus.Approved;

            // Only add experience if it's a delegation
            if (delegation.EmployeeId != null)
            {

                var experienceCommand = new AddEmployeeExperienceCommand
                {
                    FirmName =delegation.BusinessUnit.Name, // Or fetch dynamically
                    StartDate = delegation.StartDate,
                    EndDate = delegation.EndDate.HasValue ? delegation.EndDate.Value : null,
                    JobTitle = delegation.JobRole.RoleName,
                    City = address.City ?? "N/A", // Or fetch based on org or employee
                    LastSalary =  1234,
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
