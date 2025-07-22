using FluentValidation;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.Experience.Commands
{
    public class AddEmployeeExperienceCommandValidator : AbstractValidator<AddEmployeeExperienceCommand>
    {
        private readonly IDataService dataService;

        public AddEmployeeExperienceCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(experience => experience.StartDate)
                .NotEmpty().WithMessage("Start Date is required.");

            RuleFor(experience => experience.LastSalary)
                .NotEmpty().WithMessage("Last Salary is required.");

        }

    }
}
