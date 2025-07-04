using CMS.Services.DataService;
using MediatR;
using CMS.Domain;
using AutoMapper;
using CMS.Domain.Enum;
using Azure.Core;
using System.Text.Json;
using CMS.Domain.Benefit;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.CreateJobRole
{
    public class AddJobRoleCommandHandler : IRequestHandler<AddJobRoleCommand, int>
    {
        private readonly IDataService dataservice;
        private readonly IMapper mapper;
        public AddJobRoleCommandHandler(IDataService dataservice, IMapper mapper)
        {
            this.dataservice = dataservice;
            this.mapper = mapper;
        }
        public async Task<int> Handle(AddJobRoleCommand command, CancellationToken cancellationToken)
        {
            var newJobRole = new JobRole()
            {
                RoleName = command.RoleName,
                Description = command.Description,
                JobRoleCategoryId = command.JobRoleCategoryId,
                JobCatagoryId = command.JobCatagoryId,
                JobGradeId = command.JobGradeId,
                ApprovalStatus = ApprovalStatus.Draft,
                StatusRemark=command.StatusRemark,
                IsActive=ActivationEnum.Active,
            };
            foreach (var benefit in command.Benefits)
            {
                newJobRole.JobRoleBenefits.Add(new JobRoleBenefit
                {
                    BenefitId = benefit.BenefitId,
                    BenefitValueId = benefit.BenefitValueId
                    
                });
            }
            dataservice.JobRoles.Add(newJobRole);
            await dataservice.SaveAsync(cancellationToken);
            return newJobRole.Id;
        }
    }
}
