using CMS.Application.Features.Jobs.JobGrades.CreateJobGrade;
using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CMS.Application.Exceptions;

public class AddJobGradeCommandHandler : IRequestHandler<AddJobGradeCommand, int>
{
    private readonly IDataService dataService;

    public AddJobGradeCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<int> Handle(AddJobGradeCommand request, CancellationToken cancellationToken)
    {
        var jobGrade = new JobGrade
        {
            Name = request.Name,
            JobGradeRomanId = request.JobGradeRomanId,
            BaseSalary = request.BaseSalary,
            StepCoefficient = request.StepCoefficient/100,
            CeilingSalary = request.CeilingSalary,
            Description = request.Description,
            ApprovalStatus = ApprovalStatus.Draft
        };

        var steps = GenerateSteps(jobGrade.BaseSalary, jobGrade.StepCoefficient, jobGrade.JobGradeId);
        jobGrade.Steps = steps;

        if (!ValidateSteps(jobGrade.BaseSalary, jobGrade.StepCoefficient, steps))
        {
            throw new ValidationException();
        }

        if (!jobGrade.CeilingSalary.HasValue)
        {
            jobGrade.CeilingSalary = steps.Last().SalaryAmount * (1 + jobGrade.StepCoefficient);
        }
        else
        {
            var expectedCeiling = steps.Last().SalaryAmount * (1 + jobGrade.StepCoefficient);
            if (Math.Round(jobGrade.CeilingSalary.Value, 2) != Math.Round(expectedCeiling, 2))
            {
                throw new ValidationException();
            }
        }

        dataService.JobGrades.Add(jobGrade);
        await dataService.SaveAsync(cancellationToken);

        return jobGrade.JobGradeId;
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

        decimal expected = baseSalary + (baseSalary * stepCoefficient); // First step
        for (int i = 0; i < stepEnd; i++)
        {
            var step = steps[i];
            if (step.SalaryAmount <= 0 || Math.Round(step.SalaryAmount, 2) != Math.Round(expected, 2))
            {
                return false;
            }
            expected *= (1 + stepCoefficient);
        }

        return true;
    }
    private int GetStepCount()
    {
        return dataService.JobGradeStepsValues.Max(sv => sv.StepEnd);
    }

}
