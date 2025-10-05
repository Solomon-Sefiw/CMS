using FluentValidation;
using CMS.Services.DataService; // Use your DataService namespace
using CMS.Application.Features.Educations.Commands.CreateEducation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Educations.Commands.AddEducation
{
    public class CreateEducationCommandValidator : AbstractValidator<CreateEducationCommand>
    {
        private readonly IDataService _dataService;

        public CreateEducationCommandValidator(IDataService dataService)
        {
            _dataService = dataService ?? throw new ArgumentNullException(nameof(dataService));

            RuleFor(cmd => cmd.EducationLevelId)
                .NotNull()
                .WithMessage("Education Level is required.")
                .GreaterThan(0)
                .WithMessage("Education Level must be a valid positive integer.")
                .MustAsync(async (id, cancellation) => await EducationLevelExists(id, cancellation))
                .WithMessage("Selected Education Level does not exist.");

            RuleFor(cmd => cmd.StartDate)
                .NotEmpty()
                .WithMessage("Start Date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now.Date))
                .WithMessage("Start Date cannot be in the future.");

            RuleFor(cmd => cmd.EndDate)
                .NotEmpty()
                .WithMessage("End Date is required.")
                .GreaterThanOrEqualTo(cmd => cmd.StartDate)
                .WithMessage("End Date cannot be before the Start Date.")
                .MustAsync(async (cmd, endDate, cancellation) => await BeAValidEducationDuration(cmd.EducationLevelId, cmd.StartDate, endDate, cancellation))
                .WithMessage("The End Date is not logically aligned with the selected Education Level.");

            RuleFor(cmd => cmd.InstitutionNameId)
                .NotNull()
                .WithMessage("School Name is required.")
                .GreaterThan(0)
                .WithMessage("School Name must be a valid positive integer.")
                .MustAsync(async (id, cancellation) => await InstitutionNameExists(id, cancellation))
                .WithMessage("Selected School Name does not exist.");

            RuleFor(cmd => cmd.SchoolCity)
                .NotEmpty()
                .WithMessage("School City is required.")
                .MaximumLength(100)
                .WithMessage("School City cannot exceed 100 characters.");

            RuleFor(cmd => cmd.FieldOfStudyId)
                .NotNull()
                .WithMessage("Field of Study is required.")
                .GreaterThan(0)
                .WithMessage("Field of Study must be a valid positive integer.")
                .MustAsync(async (id, cancellation) => await FieldOfStudyExists(id, cancellation))
                .WithMessage("Selected Field of Study does not exist.");

            RuleFor(cmd => cmd.EmployeeId)
                .NotNull()
                .WithMessage("Employee ID is required.")
                .GreaterThan(0)
                .WithMessage("Employee ID must be a valid positive integer.")
                .MustAsync(async (id, cancellation) => await EmployeeExists(id, cancellation))
                .WithMessage("Selected Employee ID does not exist.");

            RuleFor(cmd => cmd.AwardId)
                .GreaterThan(0)
                .WithMessage("Award must be a valid positive integer.")
                .MustAsync(async (id, cancellation) => await AwardExists(id, cancellation))
                .WithMessage("Selected Award does not exist.");
        }

        private async Task<bool> EducationLevelExists(int educationLevelId, CancellationToken cancellationToken)
        {
            return await _dataService.EducationLevels.AnyAsync(el => el.Id == educationLevelId, cancellationToken);
        }

        private async Task<bool> InstitutionNameExists(int institutionNameId, CancellationToken cancellationToken)
        {
            return await _dataService.InstitutionNames.AnyAsync(i => i.Id == institutionNameId, cancellationToken);
        }

        private async Task<bool> FieldOfStudyExists(int fieldOfStudyId, CancellationToken cancellationToken)
        {
            return await _dataService.FieldOfStudies.AnyAsync(f => f.Id == fieldOfStudyId, cancellationToken);
        }
        private async Task<bool> AwardExists(int awardId, CancellationToken cancellationToken)
        {
            return await _dataService.Awards.AnyAsync(f => f.Id == awardId, cancellationToken);
        }

        private async Task<bool> EmployeeExists(int employeeId, CancellationToken cancellationToken)
        {
            return await _dataService.Employees.AnyAsync(e => e.Id == employeeId, cancellationToken);
        }

        private async Task<bool> AwardExists(int? awardId, CancellationToken cancellationToken)
        {
            if (!awardId.HasValue) return true;
            return await _dataService.Awards.AnyAsync(a => a.Id == awardId.Value, cancellationToken);
        }

        private async Task<bool> BeAValidEducationDuration(int? educationLevelId, DateOnly? startDate, DateOnly endDate, CancellationToken cancellationToken)
        {
            if (!educationLevelId.HasValue || !startDate.HasValue)
            {
                return true; // Skip validation if EducationLevelId or StartDate is not provided
            }

            var educationLevel = await _dataService.EducationLevels
                .Where(el => el.Id == educationLevelId.Value)
                .Select(el => el.Name)
                .FirstOrDefaultAsync(cancellationToken);

            if (educationLevel == null)
            {
                return true; // Skip validation if EducationLevel doesn't exist (already validated)
            }

            int startYear = startDate.Value.Year;
            int endYear = endDate.Year;
            int duration = endYear - startYear;
            string? educationLevelName = educationLevel?.ToLowerInvariant();

            // More specific and adjusted ranges for production in Addis Ababa, Ethiopia context (as of April 15, 2025)
            switch (educationLevelName)
            {
                case "grade 5":
                case "grade 6":
                case "grade 7":
                case "grade 8":
                    return duration >= 4 && duration <= 8; // Each grade is typically 1 year
                case "grade 9":
                case "grade 10":
                    return duration >= 4 && duration <= 12; // Each grade is typically 1 year (Lower Secondary)
                case "grade 11":
                case "grade 12":
                    return duration >= 4 && duration <= 15; // Each grade is typically 1 year (Upper Secondary/Preparatory)
                case "tvet level i":
                case "tvet level ii":
                case "tvet level iii":
                case "tvet level iv":
                case "tvet level v":
                    return duration >= 1 && duration <= 3; // TVET can vary
                case "certificate":
                    return duration >= 1 && duration <= 2;
                case "diploma":
                    return duration >= 2 && duration <= 3;
                case "advanced diploma":
                    return duration >= 3 && duration <= 4;
                case "associate degree":
                    return duration >= 2 && duration <= 3;
                case "bachelor's degree":
                    return duration >= 3 && duration <= 5; // Depending on the field
                case "postgraduate certificate":
                case "postgraduate diploma":
                    return duration >= 1 && duration <= 2;
                case "master's degree":
                    return duration >= 1 && duration <= 3;
                case "doctoral degree (phd)":
                    return duration >= 3 && duration <= 7; // Can vary significantly
                case "professional degree (e.g., md, jd, mba)":
                    return duration >= 2 && duration <= 4;
                case "post-doctoral":
                case "other":
                    return endYear >= startYear; // Less specific duration
                default:
                    return true; // Allow if education level is not recognized (consider logging)
            }
        }
    }
}