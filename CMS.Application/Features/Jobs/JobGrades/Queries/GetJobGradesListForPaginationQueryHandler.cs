using AutoMapper;
using CMS.Application.Features.Jobs.JobGrades.Model;
using CMS.Application.Features.Jobs.JobRoles;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record JobGradesSearchResult(List<JobGradeDto> Items, int TotalCount);
public record GetJobGradesListQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<JobGradesSearchResult>;
public class GetJobGradeListQueryHandler : IRequestHandler<GetJobGradesListQuery, JobGradesSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetJobGradeListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<JobGradesSearchResult> Handle(GetJobGradesListQuery request, CancellationToken cancellationToken)
    {
        var JobGradeList = await dataService.JobGrades.ToListAsync(cancellationToken);
        var newJobGradesList = new List<JobGradeDto>();
        var jobGradeWithList = await dataService.JobGrades
                 .Include(JG => JG.Steps)
                 .ToListAsync(cancellationToken);

        var jobGradeDtos = jobGradeWithList.Select(jg => new JobGradeDto
        {
            JobGradeId = jg.JobGradeId,
            JobGradeRomanId = jg.JobGradeRomanId,
            Name = jg.Name,
            BaseSalary = jg.BaseSalary,
            StepCoefficient = jg.StepCoefficient*100,
            CeilingSalary = jg.CeilingSalary,
            ApprovalStatus = jg.ApprovalStatus,
            Description = jg.Description,
            JobGradeSteps = jg.Steps.Select(jgs => new JobGradeStepDto
            {
                StepNumber = jgs.StepNumber,
                SalaryAmount = jgs.SalaryAmount
            }).ToList()
        }).ToList();

        if (request.Status == ApprovalStatus.Submitted)
        {
            var result = jobGradeDtos.Where(JG => JG.ApprovalStatus == ApprovalStatus.Submitted)
                                            .Skip((request.PageNumber-1)*request.PageSize)
                                            .Take(request.PageSize)
                                            .ToList();
           
            var count = await dataService.
                JobGrades.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Submitted).CountAsync();
            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Rejected)
        {
            var result = jobGradeDtos.Where(JG =>JG.ApprovalStatus == ApprovalStatus.Rejected)
                                             .Skip((request.PageNumber - 1) * request.PageSize)
                                             .Take(request.PageSize)
                                             .ToList();
            var count = await dataService.JobGrades.Where(JG =>
                    JG.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Draft)
        {
            var result = jobGradeDtos.Where(JG => JG.ApprovalStatus == ApprovalStatus.Draft)
                                        .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                        .ToList();
            var count = await dataService.JobGrades.Where(JR =>
                    JR.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(result, count);
        }
        else
        {
            var result = jobGradeDtos.Where(JG => JG.ApprovalStatus == ApprovalStatus.Approved)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
            var count = await dataService.JobRoles.Where(JR =>
                        JR.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            return new(result, count);
        }
        return null;
    }
}
