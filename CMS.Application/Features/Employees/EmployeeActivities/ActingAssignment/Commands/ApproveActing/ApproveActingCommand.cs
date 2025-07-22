using CMS.Application.Exceptions;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.ApproveActing
{
    public record ApproveActingCommand(int Id) : IRequest<int>;
    public class ApproveActingCommandHandler : IRequestHandler<ApproveActingCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;

        public ApproveActingCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }
        public async Task<int> Handle(ApproveActingCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Actings
                .Include(d => d.Employee)
                .Include(d => d.JobRole)
                .Include(d => d.BusinessUnit).Where(r => r.Id == command.Id).FirstOrDefault();
            var address = dataService.Addresses
                .Where(a => a.RequestId == delegation.BusinessUnitId && a.AddressType == AddressTypeEnum.BusinessUnitAddress).FirstOrDefault();
            if (delegation == null)
            {
                throw new NotFoundException($"Delegation with ID {command.Id} not found.");
            }
            delegation.ApprovalStatus = ApprovalStatus.Approved;

            // Only add experience if it's a delegation
            if (delegation.EmployeeId != null)
            {

                var experienceCommand = new AddEmployeeExperienceCommand
                {
                    FirmName = "Berhan Bank SC.", // Or fetch dynamically
                    StartDate = delegation.StartDate,
                    EndDate = delegation.EndDate.HasValue ? delegation.EndDate.Value : null,
                    JobTitle = delegation.JobRole.RoleName,
                    City = address.City ?? "N/A", // Or fetch based on org or employee
                    LastSalary = 1234,
                    ReasonForResignation = "Acting Asignment",
                    ExperienceType = ExperienceType.Acting,
                    EmployeeId = delegation.EmployeeId
                };

                await mediator.Send(experienceCommand, cancellationToken);
            }
            await dataService.SaveAsync(cancellationToken);

            return delegation.Id;
        }
    }
}
