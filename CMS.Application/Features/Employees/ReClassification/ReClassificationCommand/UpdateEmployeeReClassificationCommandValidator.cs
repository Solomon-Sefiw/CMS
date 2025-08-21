using FluentValidation;
using CMS.Application.Features.Employees.EmployeePromotions.Commands;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class UpdateEmployeeReClassificationCommandValidator : AbstractValidator<UpdateEmployeeReClassificationCommand>
    {
        private readonly IDataService dataService;
        public UpdateEmployeeReClassificationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            // Promotion End Date: Must be after start date
                 }

        private bool BeDifferentJobRolePromotion(UpdateEmployeePromotionCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }


    }
    }
