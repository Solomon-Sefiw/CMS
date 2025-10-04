using FluentValidation;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class AddSalaryIncrementCommandValidator : AbstractValidator<AddSalaryIncrementCommand>
    {
        private readonly IDataService dataService;

        public AddSalaryIncrementCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
        }



    }

}
