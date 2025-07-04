using FluentValidation;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.Experience.Commands
{
    public class UpdateEmployeeExperienceCommandValidator : AbstractValidator<UpdateEmployeeExperienceCommand>
    {
        private readonly IDataService dataService;

        public UpdateEmployeeExperienceCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(experience => experience.StartDate)
                .NotEmpty().WithMessage("Start Date is required.")
                .LessThan(experience => experience.EndDate).WithMessage("Start Date must be before End Date.");

            RuleFor(experience => experience.EndDate)
                .NotEmpty().WithMessage("End Date is required.");

            RuleFor(experience => experience.LastSalary)
                .NotEmpty().WithMessage("Last Salary is required.");

            RuleFor(experience => experience)
                .Must(BeUniqueExperience).WithMessage("An experience with the same Start Date and End Date already exists.");

            RuleFor(experience => experience)
                .Must(BeMoreThanSixMonths).WithMessage("Experience must be at least six months long.");
        }

        private bool BeUniqueExperience(UpdateEmployeeExperienceCommand command)
        {
            return !dataService.EmployeeExperiences
                .Any(exp => exp.StartDate == command.StartDate && exp.EndDate == command.EndDate && exp.EmployeeId == command.EmployeeId && exp.Id !=command.Id);
        }

        private bool BeMoreThanSixMonths(UpdateEmployeeExperienceCommand command)
        {
            var startDate = command.StartDate.ToDateTime(new TimeOnly(0, 0));  // Convert DateOnly to DateTime
            var endDate = command.EndDate.ToDateTime(new TimeOnly(0, 0));  // Convert DateOnly to DateTime

            var experienceDuration = endDate - startDate;
            return experienceDuration.Days >= 180; 
        }
    }
}
