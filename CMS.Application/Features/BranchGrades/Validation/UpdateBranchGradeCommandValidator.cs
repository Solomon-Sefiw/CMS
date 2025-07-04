using FluentValidation;
using CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Validation
{
    public class UpdateBranchGradeCommandValidator:AbstractValidator<UpdateBranchGradeCommand>
    {
        private readonly IDataService _dataService;
        public UpdateBranchGradeCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.staffLimit).GreaterThan(0).WithMessage("Staff Strength required .");
            RuleFor(x => x.description)
                .NotEmpty().WithMessage("Description is required.")
                .Length(4, 200).WithMessage("Description must be between 5 and 200 characters.");
           RuleFor(x => x.grade)
               .NotEmpty().WithMessage("Branch Grade is required.")
               .Matches("^(?i)(I|II|III|IV|V|VI|VII|VIII|IX|X)$")
               .WithMessage("Branch Grade must be a valid Roman numeral between I and X.")
               .MustAsync(BeUniqueGrade).WithMessage("Branch Grade already exists.");
        }
        private async Task<bool> BeUniqueGrade(UpdateBranchGradeCommand model, string grade, CancellationToken cancellationToken)
        {
            return !await _dataService.BranchGrades
                .AnyAsync(x => x.Grade.ToLower() == grade.ToLower() && x.Id != model.Id, cancellationToken);
        }

    }
}
