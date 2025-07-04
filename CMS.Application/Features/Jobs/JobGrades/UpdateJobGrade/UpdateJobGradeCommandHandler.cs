using CMS.Application.Exceptions;
using CMS.Application.Features.Jobs.JobGrades.UpdateJobGrade;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdateJobGradeCommandHandler : IRequestHandler<UpdateJobGradeCommand, int>
{
    private readonly IDataService _dataService;
    public UpdateJobGradeCommandHandler(IDataService dataService)
    {
        _dataService = dataService;
    }
    public async Task<int> Handle(UpdateJobGradeCommand request, CancellationToken cancellationToken)
    {
        var jobGrade = await _dataService.JobGrades
            .Include(j => j.Steps)
            .FirstOrDefaultAsync(j => j.JobGradeId == request.JobGradeId, cancellationToken);

        if (jobGrade == null)
            throw new KeyNotFoundException("JobGrade not found.");

        jobGrade.Name = request.Name;
        jobGrade.BaseSalary = request.BaseSalary;
        jobGrade.StepCoefficient = request.StepCoefficient/100;
        jobGrade.Description = request.Description;
        jobGrade.JobGradeRomanId = request.JobGradeRomanId;
        jobGrade.CeilingSalary = request.CeilingSalary;
        jobGrade.ApprovalStatus = ApprovalStatus.Draft; ;

        var newSteps = GenerateSteps(jobGrade.BaseSalary, jobGrade.StepCoefficient, jobGrade.JobGradeId);

        foreach (var newStep in newSteps)
        {
            var existing = jobGrade.Steps.FirstOrDefault(s => s.StepNumber == newStep.StepNumber);

            if (existing != null)
            {
                existing.SalaryAmount = newStep.SalaryAmount;
            }
            else
            {
                jobGrade.Steps.Add(newStep);
            }
        }

        var validStepNumbers = newSteps.Select(s => s.StepNumber).ToHashSet();
        jobGrade.Steps.RemoveAll(s => !validStepNumbers.Contains(s.StepNumber));
        if (!ValidateSteps(jobGrade.BaseSalary, jobGrade.StepCoefficient, jobGrade.Steps))
        {
            throw new ValidationException();
        }
        if (!jobGrade.CeilingSalary.HasValue)
        {
            jobGrade.CeilingSalary = jobGrade.Steps.Last().SalaryAmount * (1 + jobGrade.StepCoefficient);
        }
        else
        {
            var expected = jobGrade.Steps.Last().SalaryAmount * (1 + jobGrade.StepCoefficient);
            if (Math.Round(jobGrade.CeilingSalary.Value, 2) != Math.Round(expected, 2))
            {
                throw new ValidationException();
            }
        }
        await _dataService.SaveAsync(cancellationToken);
        return (int)jobGrade.JobGradeId;
    }
    private List<JobGradeStep> GenerateSteps(decimal baseSalary, decimal stepCoefficient, int jobGradeId)
    {
        int stepEnd = GetStepCount();
        var steps = new List<JobGradeStep>();
        decimal currentAmount = baseSalary + (baseSalary * stepCoefficient); // Step 1
        steps.Add(new JobGradeStep
        {
            JobGradeId = jobGradeId,
            StepNumber = 1,
            SalaryAmount = Math.Round(currentAmount, 2)
        });

        for (int i = 2; i <= stepEnd; i++)
        {
            currentAmount *= (1 + stepCoefficient);
            steps.Add(new JobGradeStep
            {
                JobGradeId = jobGradeId,
                StepNumber = i,
                SalaryAmount = Math.Round(currentAmount, 2)
            });
        }

        return steps;
    }

    private bool ValidateSteps(decimal baseSalary, decimal stepCoefficient, List<JobGradeStep> steps)
    {
        int stepEnd = GetStepCount();

        if (steps.Count != stepEnd) return false;

        decimal expected = baseSalary + (baseSalary * stepCoefficient);
        for (int i = 0; i < stepEnd; i++)
        {
            if (Math.Round(steps[i].SalaryAmount, 2) != Math.Round(expected, 2))
            {
                return false;
            }
            expected *= (1 + stepCoefficient);
        }

        return true;
    }
    private int GetStepCount()
    {
        return _dataService.JobGradeStepsValues.Max(sv => sv.StepEnd);
    }

}
