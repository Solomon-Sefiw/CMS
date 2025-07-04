using FluentValidation;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application;


public class SubmitEmployeeApprovalRequestCommandValidator : AbstractValidator<SubmitEmployeeApprovalRequestCommand>
{
    private readonly IDataService dataService;

    public SubmitEmployeeApprovalRequestCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.Note).NotEmpty().WithMessage("Comment is required for submission.");
        }

    private async Task<bool> HaveBirthCertificateAttachment(SubmitEmployeeApprovalRequestCommand command, CancellationToken token)
    {
        var employee = await dataService.Employees.FirstOrDefaultAsync(s => s.Id == command.Id);
        if (employee == null || employee.BirthDate == null) return true;


        var dateOfBirth = employee.BirthDate.ToDateTime(TimeOnly.Parse("00:00"));

        int calculatedAge = DateTime.Today.Year - dateOfBirth.Year;
        if (dateOfBirth > DateTime.Today.AddYears(-calculatedAge))
        {
            calculatedAge--;
        }

        var isMinor = calculatedAge < 18;
        if (!isMinor) return true;

        var hasBirthCertificateCertificate = await dataService.EmployeeDocuments.AnyAsync(d => d.EmployeeId == command.Id && d.DocumentType == DocumentType.BirthCertificate);

        return hasBirthCertificateCertificate;
    }

}
