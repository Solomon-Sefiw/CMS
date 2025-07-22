using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Delegation.Commands.CreateDelegation;

namespace CMS.Application.Features.DelegationAssignments.Commands.CreateDelegationAssignment
{
    public class CreateDelegationValidator : AbstractValidator<CreateDelegationCommand>
    {
        public CreateDelegationValidator()
        {
            RuleFor(x => x.EmployeeId).GreaterThan(0);
            RuleFor(x => x.JobRoleId).GreaterThan(0);
            RuleFor(x => x.StartDate).NotEmpty();
            RuleFor(x => x.BusinessUnitId).GreaterThan(0);
        }
    }
}
