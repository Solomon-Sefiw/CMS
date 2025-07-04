
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CMS.Application.Features.Jobs.JobRoles.Models;

namespace CMS.Application.Features.Jobs.JobRoles.Queries
{
    public record GetJobRoleByIdQuery(int ID) : IRequest<JobRoleWithBenefitDto>;

    public class GetJobRoleByIdQueryHandler : IRequestHandler<GetJobRoleByIdQuery, JobRoleWithBenefitDto>
    {
        private readonly IDataService dataservice;

        public GetJobRoleByIdQueryHandler(IDataService service)
        {
            this.dataservice = service;
        }
        public async Task<JobRoleWithBenefitDto> Handle(GetJobRoleByIdQuery query, CancellationToken token)
        {
            var jobRole = await dataservice.JobRoles
                .Include(j => j.JobRoleBenefits)
                    .ThenInclude(jrb => jrb.Benefit)
                        .ThenInclude(b => b.UnitOfMeasurement)
                .Include(j => j.JobRoleBenefits)
                    .ThenInclude(jrb => jrb.BenefitValue)
                .Include(j => j.JobCatagory)
                .Include(j => j.JobGrade)
                .Include(j => j.JobRoleCategory)
                .FirstOrDefaultAsync(j => j.Id == query.ID, token);

            if (jobRole == null)
                throw new Exception("Unable to find JobRole");

            var result = new JobRoleWithBenefitDto
            {
                Id = jobRole.Id,
                RoleName = jobRole.RoleName,
                Description = jobRole.Description,
                JobCatagoryId = jobRole.JobCatagoryId,
                JobGradeId = jobRole.JobGradeId,
                JobRoleCategoryId = jobRole.JobRoleCategoryId,
                ApprovalStatus = jobRole.ApprovalStatus,
                IsActive = jobRole.IsActive,

                Benefits = jobRole.JobRoleBenefits?.Select(jrb =>
                {
                    var benefit = new
                    {
                        jrb.Benefit.Id,
                        jrb.Benefit.Name,
                        UnitOfMeasurement = jrb.Benefit.UnitOfMeasurement,
                        UnitPrices = jrb.Benefit.BenefitUnitPrices?
                            .Where(p => p.ApprovalStatus == ApprovalStatus.Approved && p.IsActive == ActivationEnum.Active)
                            .OrderByDescending(p => p.EffectiveDate)
                            .ToList()
                    };

                    var latestUnitPrice = benefit.UnitPrices?.FirstOrDefault();

                    return new JobRoleBenefitDto
                    {
                        Id = jrb.Id,
                        BenefitId = jrb.BenefitId,
                        BenefitName = benefit.Name ?? string.Empty,
                        UnitOfMeasurementName = benefit.UnitOfMeasurement?.Name ?? string.Empty,
                        IsUnitPriced = benefit.UnitOfMeasurement?.IsUnitPriced ?? false,
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
                }).ToList() ?? new List<JobRoleBenefitDto>()
            };

            return result;
        }

    }
}



