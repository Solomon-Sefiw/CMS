using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Commands.UpdateEmeregencyContact
{
    public class UpdateEmployeeEmergencyContactCommandValidator : AbstractValidator<UpdateEmployeeEmergencyContactCommand>
    {
        public UpdateEmployeeEmergencyContactCommandValidator()
        {

            // Rule for Name: Not empty, no special characters, no numbers
            RuleFor(contact => contact.Name)
                .NotEmpty().WithMessage("Name is required.")
                .Must(NotContainSpecialCharacters).WithMessage("Name must not contain special characters.")
                .Must(NotContainNumbers).WithMessage("Name must not contain numbers.");

            // Rule for MiddleName: Not empty, no special characters, no numbers
            RuleFor(contact => contact.MiddleName)
                .NotEmpty().WithMessage("Middle Name is required.")
                .Must(NotContainSpecialCharacters).WithMessage("Middle Name must not contain special characters.")
                .Must(NotContainNumbers).WithMessage("Middle Name must not contain numbers.");

            // Rule for LastName: Not empty, no special characters, no numbers
            RuleFor(contact => contact.LastName)
                .NotEmpty().WithMessage("Last Name is required.")
                .Must(NotContainSpecialCharacters).WithMessage("Last Name must not contain special characters.")
                .Must(NotContainNumbers).WithMessage("Last Name must not contain numbers.");

            // Rule for WorkingFirmName: No special characters, no numbers
            RuleFor(contact => contact.WorkingFirmName)
                .NotEmpty().WithMessage("Working Firm Name is required if the employee is working.")
                .When(contact => contact.IsWorking)
                .Must(NotContainSpecialCharacters).WithMessage("Working Firm Name must not contain special characters.")
                .Must(NotContainNumbers).WithMessage("Working Firm Name must not contain numbers.");

            // Rule for EmployeeId: Positive integer if not null
            RuleFor(contact => contact.EmployeeId)
                .GreaterThan(0).WithMessage("EmployeeId must be a positive integer.");
        }

        // Helper method to check if the string contains special characters
        private bool NotContainSpecialCharacters(string input)
        {
            return input.All(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c));
        }

        // Helper method to check if the string contains numbers
        private bool NotContainNumbers(string input)
        {
            return !input.Any(char.IsDigit);
        }
    }
}
