using AutoMapper;
using CMS.Domain.Benefit;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.UpdateJobRole
{
    public class UpdateJobRoleCommandHandler : IRequestHandler<UpdateJobRoleCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        public UpdateJobRoleCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<int> Handle(UpdateJobRoleCommand command, CancellationToken cancellationtoken)
        {

            var jobRole = await dataService.JobRoles
            .Include(j => j.JobRoleBenefits)
            .FirstOrDefaultAsync(j => j.Id == command.Id, cancellationtoken);

            if (jobRole != null)
            {
                jobRole.RoleName = command.RoleName;
                jobRole.JobCatagoryId = command.JobCatagoryId;
                jobRole.JobRoleCategoryId = command.JobRoleCategoryId;
                jobRole.JobGradeId = command.JobGradeId;
                jobRole.Description = command.Description;
                jobRole.ApprovalStatus = ApprovalStatus.Draft;
                var existingBenefits = jobRole.JobRoleBenefits
                      .Where(rb => !rb.IsDeleted) 
                      .ToDictionary(rb => rb.BenefitId, rb => rb);

                var incomingBenefitIds = command.Benefits.Select(b => b.BenefitId).ToHashSet();

                foreach (var incoming in command.Benefits)
                {
                    if (existingBenefits.TryGetValue(incoming.BenefitId, out var existing))
                    {
                        if (existing.BenefitValueId != incoming.BenefitValueId)
                        {
                            existing.BenefitValueId = incoming.BenefitValueId;
                            existing.ModifiedDate = DateTime.UtcNow;
                        }
                    }
                    else
                    { 
                        var softDeleted = jobRole.JobRoleBenefits
                            .FirstOrDefault(rb => rb.BenefitId == incoming.BenefitId && rb.IsDeleted);

                        if (softDeleted != null)
                        {
                            softDeleted.IsDeleted = false;
                            softDeleted.DeletedDate = null;
                            softDeleted.BenefitValueId = incoming.BenefitValueId;
                            softDeleted.ModifiedDate = DateTime.UtcNow;
                        }
                        else
                        {
                            jobRole.JobRoleBenefits.Add(new JobRoleBenefit
                            {
                                BenefitId = incoming.BenefitId,
                                BenefitValueId = incoming.BenefitValueId,
                                JobRoleId = jobRole.Id,
                                CreatedDate = DateTime.UtcNow
                            });
                        }
                    }
                }
                var benefitsToSoftDelete = jobRole.JobRoleBenefits
                    .Where(rb => !incomingBenefitIds.Contains(rb.BenefitId) && !rb.IsDeleted)
                    .ToList();

                foreach (var toDelete in benefitsToSoftDelete)
                {
                    toDelete.IsDeleted = true;
                    toDelete.DeletedDate = DateTime.UtcNow;
                }

            }
            await dataService.SaveAsync(cancellationtoken);
            return jobRole.Id;
        }
    }
}
