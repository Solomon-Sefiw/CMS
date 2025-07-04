using FluentValidation;
using CMS.Domain;
using CMS.Services.DataService;
using System.Text.RegularExpressions;
using System.Web;

namespace CMS.Application.Features.Employees.Guranters.Commands
{
    public class AddEmployeeExperienceCommandValidator : AbstractValidator<AddEmployeeGurantersCommand>
    {
        private readonly IDataService dataService;

        public AddEmployeeExperienceCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;           
        }
    
    }
}