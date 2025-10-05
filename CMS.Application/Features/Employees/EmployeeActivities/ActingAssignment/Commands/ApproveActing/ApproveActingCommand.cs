using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

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

        var acting = await dataService.Actings
                      .Include(d => d.Employee)
                      .ThenInclude(e => e.Job) 
                      .Include(d => d.JobRole)
                      .Include(d => d.BusinessUnit)
                      .FirstOrDefaultAsync(r => r.Id == command.Id, cancellationToken);
        var employee = acting.Employee;

        acting.ApprovalStatus = ApprovalStatus.Approved;
        acting.IsActive = false;
        var address = await dataService.Addresses
            .Where(a => a.RequestId == acting.BusinessUnitId && a.AddressType == AddressTypeEnum.BusinessUnitAddress)
            .FirstOrDefaultAsync(cancellationToken);

        var city = address?.City ?? "N/A";
        // Only add experience if it's is Not Temporary
        if (acting.ActingType != ActingType.Temporary)
        {
            if (acting.EmployeeId != null)
            {
                // Experience End Date Update
                var latestExperience = await dataService.EmployeeExperiences
                        .Where(e => e.EmployeeId == acting.EmployeeId)
                        .OrderByDescending(e => e.StartDate)
                       .FirstOrDefaultAsync(cancellationToken);

                if (latestExperience != null)
                {
                    latestExperience.EndDate = acting.StartDate.AddDays(-1);
                    dataService.EmployeeExperiences.Update(latestExperience);
                }
                //---------------------------------------------------------------------------------------------//
                // Acting End Date Update
                var previousActing = await dataService.Actings
                    .Where(e =>
                        e.EmployeeId == acting.EmployeeId &&
                        e.Id != acting.Id && // Exclude the current acting
                        e.StartDate < acting.StartDate)
                    .OrderByDescending(e => e.StartDate)
                    .FirstOrDefaultAsync(cancellationToken);

                if (previousActing != null)
                {
                    previousActing.EndDate = acting.StartDate.AddDays(-1);
                    dataService.Actings.Update(previousActing);
                }
                //-------------------------------------------------------------------------------------------//
                // ✅ Log acting experience
                await mediator.Send(new AddEmployeeExperienceCommand
                {
                    FirmName = "Amhara Court",
                    StartDate = acting.StartDate,
                    EndDate = acting.EndDate ?? null,
                    JobTitle = acting.JobRole.RoleName,
                    City = city,
                    LastSalary = 0,
                    ReasonForResignation = acting.ActingType == ActingType.Permanent ? "Acting Assignmet" : "Reassignment",
                    ExperienceType = acting.ActingType == ActingType.Permanent ? ExperienceType.Acting : ExperienceType.Reassignment,
                    EmployeeId = acting.EmployeeId
                }, cancellationToken);
                // ✅ Update employee record
                employee.Job.JobRoleId = acting.JobRoleId;
                employee.BusinessUnitID = acting.BusinessUnitId ?? employee.BusinessUnitID;
                employee.SkipStateTransitionCheck = true;
            }
        }
        await dataService.SaveAsync(cancellationToken);
        return acting.Id;
    }
}

