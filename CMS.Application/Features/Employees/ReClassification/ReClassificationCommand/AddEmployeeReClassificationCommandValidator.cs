using FluentValidation;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class AddEmployeeReClassificationCommandValidator : AbstractValidator<AddEmployeeReClassificationCommand>
    {
        private readonly IDataService dataService;

        public AddEmployeeReClassificationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
     }

        private bool BeDifferentJobRolePromotion(AddEmployeeReClassificationCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }

    }

}
