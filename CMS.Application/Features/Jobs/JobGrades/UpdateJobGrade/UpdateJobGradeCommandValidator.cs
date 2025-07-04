using FluentValidation;
using CMS.Services.DataService;

namespace CMS.Application.Features.Jobs.JobGrades.UpdateJobGrade
{
    public class UpdateJobGradeCommandValidator : AbstractValidator<UpdateJobGradeCommand>
    {
        private readonly IDataService dataService;

        public UpdateJobGradeCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
           // RuleFor(p => p).Must(IsJobGradeUnique).WithMessage("Job Grade Name Already Exist");
        }
        private bool IsJobGradeUnique(UpdateJobGradeCommand command)
        {
            return !dataService.JobGrades.Any(x =>
                (x.Name == command.Name || x.JobGradeId == command.JobGradeId) &&
                x.JobGradeId != command.JobGradeId);
        }

    }
}