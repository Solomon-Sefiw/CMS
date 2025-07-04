using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using CMS.Application.Features.Language.Commands.UpdateLanguageSkill;

namespace CMS.Application.Features.Language.Commands.CreateLanguageSkill
{
    public class UpdateLanguageSkillCommandValidator : AbstractValidator<UpdateLanguageSkillCommand>
    {
        public UpdateLanguageSkillCommandValidator()
        {
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

        }
    }
}

