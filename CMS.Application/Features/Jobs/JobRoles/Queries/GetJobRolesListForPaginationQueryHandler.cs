using AutoMapper;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Jobs.JobRoles;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record JobRolesSearchResult(List<JobRoleDto> Items, int TotalCount);
public record GetJobRolesListQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<JobRolesSearchResult>;
public class GetJobRolesListQueryHandler : IRequestHandler<GetJobRolesListQuery, JobRolesSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetJobRolesListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<JobRolesSearchResult> Handle(GetJobRolesListQuery request, CancellationToken cancellationToken)
    {
        var jobRolesList = await dataService.JobRoles
            .Include(jr => jr.JobRoleBenefits)
                .ThenInclude(jrb => jrb.Benefit)
                    .ThenInclude(b => b.UnitOfMeasurement)
            .Include(jr => jr.JobRoleBenefits)
                .ThenInclude(jrb => jrb.BenefitValue)
            .Include(jr => jr.JobRoleBenefits)
                .ThenInclude(jrb => jrb.Benefit.BenefitUnitPrices)
            .OrderBy(role => role.RoleName)
            .ToListAsync(cancellationToken);

        var jobGradeList = await dataService.JobGrades.ToListAsync(cancellationToken);
        var jobCatagoryList = await dataService.JobCatagories.ToListAsync(cancellationToken);
        var jobRoleCatagoryList = await dataService.JobRoleCatagories.ToListAsync(cancellationToken);

        var newJobRolesList = new List<JobRoleDto>();

        foreach (var jr in jobRolesList)
        {
            var jobGrade = jobGradeList.FirstOrDefault(jg => jg.JobGradeId == jr.JobGradeId);
            var jobCatagory = jobCatagoryList.FirstOrDefault(jc => jc.Id == jr.JobCatagoryId);
            var jobRoleCatagory = jobRoleCatagoryList.FirstOrDefault(jrc => jrc.Id == jr.JobRoleCategoryId);

            var jobRole = new JobRoleDto
            {
                Id = jr.Id,
                RoleName = jr.RoleName,
                JobCatagory = jobCatagory?.JobCategoryName ?? string.Empty,
                JobRoleCatagory = jobRoleCatagory?.Name ?? string.Empty,
                JobGrade = (JobGradeRomanId)(jobGrade?.JobGradeRomanId),
                ApprovalStatus = jr.ApprovalStatus,
                IsActive = jr.IsActive,
                Description = jr.Description,
                Benefits = jr.JobRoleBenefits.Select(jrb =>
                {
                    var benefit = jrb.Benefit;
                    var unitOfMeasurement = benefit.UnitOfMeasurement;
                    var latestUnitPrice = benefit.BenefitUnitPrices
                        ?.Where(p => p.ApprovalStatus == ApprovalStatus.Approved && p.IsActive == ActivationEnum.Active)
                        .OrderByDescending(p => p.EffectiveDate)
                        .FirstOrDefault();

                    return new JobRoleBenefitDto
                    {
                        Id = jrb.Id,
                        BenefitId = jrb.BenefitId,
                        BenefitName = benefit.Name,
                        UnitOfMeasurementName = unitOfMeasurement?.Name ?? "",
                        IsUnitPriced = unitOfMeasurement?.IsUnitPriced ?? false,
                        BenefitValueId = jrb.BenefitValueId,
                        Value = jrb.BenefitValue?.Value ?? 0,
                        UnitPrice = latestUnitPrice?.Price,
                        ApprovalStatus = jrb.BenefitValue?.ApprovalStatus ?? ApprovalStatus.Draft,
                        Description = jrb.BenefitValue?.Description,
                        Remark = jrb.BenefitValue?.Remark,
                        LatestUnitPrice = latestUnitPrice != null ? new BenefitUnitPriceDto
                        {
                            Id = latestUnitPrice.Id,
                            BenefitId = latestUnitPrice.BenefitId,
                            Price = latestUnitPrice.Price,
                            EffectiveDate = latestUnitPrice.EffectiveDate,
                            ApprovalStatus = latestUnitPrice.ApprovalStatus,
                            Remark = latestUnitPrice.Remark
                        } : null
                    };
                }).ToList()

            };

            newJobRolesList.Add(jobRole);
        }
        List<JobRoleDto> result;
        int count;

        if (request.Status == ApprovalStatus.Submitted)
        {
            result = newJobRolesList
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Submitted)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.JobRoles
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync();
        }
        else if (request.Status == ApprovalStatus.Rejected)
        {
            result = newJobRolesList
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Rejected)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.JobRoles
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync();
        }
        else if (request.Status == ApprovalStatus.Draft)
        {
            result = newJobRolesList
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Draft)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.JobRoles
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync();
        }
        else
        {
            result = newJobRolesList
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Approved)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.JobRoles
                .Where(jr => jr.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync();
        }

        return new JobRolesSearchResult(result, count);
    }

}
