

using FluentValidation;
using CMS.Application.Features.Educations.Commands.UpdateEducation;

namespace CMS.Application.Features.Educations.Commands.AddEducation
{
    public class UpdateEducationCommandValidator : AbstractValidator<UpdateEducationCommand>
    {
        public UpdateEducationCommandValidator()
        {
            RuleFor(cmd => cmd.EducationLevelId)
                .NotNull()
                .WithMessage("Education Level is required.")
                .GreaterThan(0)
                .WithMessage("Education Level must be a valid positive integer.");
            RuleFor(cmd => cmd.StartDate)
                .NotEmpty()
                .WithMessage("Start Date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
                .WithMessage("Start Date cannot be in the future.");

            RuleFor(cmd => cmd.EndDate)
                .NotEmpty()
                .WithMessage("End Date is required.")
                .GreaterThanOrEqualTo(cmd => cmd.StartDate)
                .WithMessage("End Date cannot be before the Start Date.");

            RuleFor(cmd => cmd.InstitutionNameId)
                .NotNull()
                .WithMessage("School Name is required.")
                .GreaterThan(0)
                .WithMessage("School Name must be a valid positive integer.");

            RuleFor(cmd => cmd.SchoolCity)
                .NotEmpty()
                .WithMessage("School City is required.")
                .MaximumLength(100) // Increased for potential longer city names
                .WithMessage("School City cannot exceed 100 characters.");

            RuleFor(cmd => cmd.FieldOfStudyId)
          .NotNull()
    .WithMessage("Field of Study is required.")
    .GreaterThan(0)
    .WithMessage("Field of Study must be a valid positive integer.");

            RuleFor(cmd => cmd.EmployeeId)
                .NotNull()
                .WithMessage("Employee ID is required.")
                .GreaterThan(0)
                .WithMessage("Employee ID must be a valid positive integer.");

            // Custom validation for logical date alignment with Education Level
            //RuleFor(cmd => cmd)
            //    .Must(BeValidEducationDates)
            //    .WithMessage("The start and end dates are not logically aligned with the Education Level.");

            // Custom validation to prevent enrollment in Elementary or High School in the graduation year or later
            //RuleFor(cmd => cmd)
            //    .Must((cmd, _) => !IsElementaryOrHighSchoolAfterOrInGraduationYear(cmd.EducationLevelId, cmd.StartDate, cmd.EndDate))
            //    .WithMessage("An employee cannot be in elementary or high school in the year they graduated or later.");
        }

        //private bool BeValidEducationDates(CreateEducationCommand education)
        //{
        //    int startYear = education.StartDate.Year;
        //    int endYear = education.EndDate.Year;

        //    switch (education.EducationLevel)
        //    {
        //        case EducationLevelEnum.Primary:
        //            return (endYear - startYear) >= 4 && (endYear - startYear) <= 8; // Typical duration
        //        case EducationLevelEnum.MiddleSchool:
        //            return (endYear - startYear) >= 2 && (endYear - startYear) <= 4; // Typical duration
        //        case EducationLevelEnum.HighSchool:
        //            return (endYear - startYear) >= 3 && (endYear - startYear) <= 5; // Typical duration
        //        case EducationLevelEnum.Vocational:
        //            return (endYear - startYear) >= 0 && (endYear - startYear) <= 4; // Flexible
        //        case EducationLevelEnum.Associate:
        //            return (endYear - startYear) >= 1 && (endYear - startYear) <= 4; // Flexible
        //        case EducationLevelEnum.Bachelor:
        //            return (endYear - startYear) >= 3 && (endYear - startYear) <= 6; // Including potential co-op
        //        case EducationLevelEnum.PostgraduateDiploma:
        //        case EducationLevelEnum.Master:
        //            return (endYear - startYear) >= 2 && (endYear - startYear) <= 4; // Flexible
        //        case EducationLevelEnum.Doctorate:
        //            return (endYear - startYear) >= 5 && (endYear - startYear) <= 8;
        //        case EducationLevelEnum.PostDoctorate:
        //            return (endYear - startYear) >= 2 && (endYear - startYear) <= 8; // Can vary significantly
        //        case EducationLevelEnum.Professional:
        //            return endYear >= startYear; // Basic check
        //        case EducationLevelEnum.Certificate:
        //            return endYear >= startYear; // Basic check
        //        case EducationLevelEnum.Diploma:
        //            return (endYear - startYear) >= 1 && (endYear - startYear) <= 8; // Flexible
        //        case EducationLevelEnum.Other:
        //            return endYear >= startYear; // Basic check
        //        default:
        //            return true;
        //    }
        //}

        //private bool IsElementaryOrHighSchoolAfterOrInGraduationYear(int level, DateOnly startDate, DateOnly endDate)
        //{
        //    if (level == EducationLevelEnum.Primary || level == EducationLevelEnum.HighSchool)
        //    {
        //        return startDate.Year >= endDate.Year;
        //    }
        //    return false;
        //}
    }
}