using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Services.DataService;

namespace CMS.Application.Features.Language.Commands.CreateLanguageSkill
{
    public class CreateLanguageSkillCommandValidator : AbstractValidator<CreateLanguageSkillCommand>
    {
        private readonly IDataService dataService;

        public CreateLanguageSkillCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(bu => bu).Must(IsLanguageUnique).WithMessage("Language Name Already Exist");
            RuleFor(x => x.Language)
                .IsInEnum()
                .WithMessage("Invalid language selection.");

            RuleFor(x => x.Speaking)
                .IsInEnum()
                .WithMessage("Speaking skill level is required.");

            RuleFor(x => x.Listening)
                .IsInEnum()
                .WithMessage("Listening skill level is required.");

            RuleFor(x => x.Writing)
                .IsInEnum()
                .WithMessage("Writing skill level is required.");

            RuleFor(x => x.Reading)
                .IsInEnum()
                .WithMessage("Reading skill level is required.");

            RuleFor(x => x.EmployeeId)
                .NotNull()
                .WithMessage("EmployeeId is required.")
                .GreaterThan(0)
                .WithMessage("EmployeeId must be greater than 0.");
            
        }

        private bool IsLanguageUnique(CreateLanguageSkillCommand command) => !dataService.LanguageSkills.Any(x => x.Language == command.Language && x.EmployeeId == command.EmployeeId);
    }
}

