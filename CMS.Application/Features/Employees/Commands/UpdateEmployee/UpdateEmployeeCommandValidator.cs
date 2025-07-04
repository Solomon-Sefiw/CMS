using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentValidation;

namespace CMS.Application.Features.Employees.Commands.UpdateEmployee
{
    public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
    {
        public UpdateEmployeeCommandValidator()
        {
            RuleFor(x => x.FirstName)
                       .NotEmpty().WithMessage("First Name is required.")
                       .Matches("^[a-zA-Z]+$").WithMessage("First name must contain only letters.")
                       .MaximumLength(50).WithMessage("First Name cannot exceed 50 characters.");

            RuleFor(x => x.MiddleName)
                .NotEmpty().WithMessage("Middle Name is required.")
                .Matches("^[a-zA-Z]+$").WithMessage("First name must contain only letters.")
                .MaximumLength(50).WithMessage("Middle Name cannot exceed 50 characters.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last Name is required.")
                .Matches("^[a-zA-Z]+$").WithMessage("First name must contain only letters.")
                .MaximumLength(50).WithMessage("Last Name cannot exceed 50 characters.");

            RuleFor(x => x.AmharicFirstName)
                .NotEmpty().WithMessage("Amharic First Name is required.")
                .MaximumLength(50).WithMessage("Amharic First Name cannot exceed 50 characters.")
                .Must(BeAmharicText).WithMessage("Amharic First Name must contain only Amharic letters.");

            RuleFor(x => x.AmharicMiddleName)
                .MaximumLength(50).WithMessage("Amharic Middle Name cannot exceed 50 characters.")
                .Must(BeAmharicText).When(x => !string.IsNullOrEmpty(x.AmharicMiddleName))
                .WithMessage("Amharic Middle Name must contain only Amharic letters.");

            RuleFor(x => x.AmharicLastName)
                .NotEmpty().WithMessage("Amharic Last Name is required.")
                .MaximumLength(50).WithMessage("Amharic Last Name cannot exceed 50 characters.")
                .Must(BeAmharicText).WithMessage("Amharic Last Name must contain only Amharic letters.");

            RuleFor(x => x.BusinessUnitID)
                .GreaterThan(0).WithMessage("Business Unit ID is required and must be greater than 0.");

            RuleFor(x => x.JobId)
                .GreaterThan(0).WithMessage("Job ID is required and must be greater than 0.");

            RuleFor(x => x.BirthDate)
                .NotEmpty().WithMessage("Birth Date is required.")
                .Must(BeAtLeast18YearsOld).WithMessage("Employee must be at least 18 years old.");

            RuleFor(x => x.EmployementDate)
                .NotEmpty().WithMessage("Employment Date is required.")
                .GreaterThan(x => x.BirthDate.AddYears(-18)).WithMessage("Employee must be at least 18 years old");

            RuleFor(x => x.Gender)
                .IsInEnum().WithMessage("Invalid gender selection.");

            RuleFor(x => x.MartialStatus)
                .IsInEnum().WithMessage("Invalid marital status selection.");
        }

        private bool BeAmharicText(string text)
        {
            // Regex to validate Amharic Unicode characters
            var amharicRegex = new Regex(@"^[\u1200-\u137F]+$");
            return amharicRegex.IsMatch(text);
        }

        private bool BeAtLeast18YearsOld(DateOnly birthDate)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var age = today.Year - birthDate.Year;

            if (birthDate > today.AddYears(-age)) age--; // Adjust for a non-birthday yet this year
            return age >= 18;
        }
    }
}
