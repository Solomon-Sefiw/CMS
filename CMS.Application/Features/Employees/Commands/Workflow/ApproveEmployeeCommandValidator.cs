using FluentValidation;
using CMS.Domain.Enum;
using CMS.Services.DataService;


namespace CMS.Application;

public class ApproveEmployeeCommandValidator : AbstractValidator<ApproveEmployeeCommand>
{
    private readonly IDataService dataService;

    public ApproveEmployeeCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.Note).NotEmpty().WithMessage("Approval comment is required.");
        RuleFor(p => p)
            .Must(Exist)
            .WithMessage(x => $"Unable to find Employee.");
        RuleFor(p => p)
            .Must(ShouldHaveSubmittedForApprovalStatus)
            .WithMessage(x => $"Cannot Approve a Employee that is not submitted for approval.");
    }

    private bool Exist(ApproveEmployeeCommand command)
    {
        return dataService.Employees.Any(s => s.Id == command.Id);
    }

    private bool ShouldHaveSubmittedForApprovalStatus(ApproveEmployeeCommand command)
    {
        return dataService.Employees.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
    }
}
