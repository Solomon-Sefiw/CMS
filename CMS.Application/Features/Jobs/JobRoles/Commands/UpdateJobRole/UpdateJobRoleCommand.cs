using CMS.Application.Features.Benefits.Model;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.UpdateJobRole
{
    public class UpdateJobRoleCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int JobCatagoryId { get; set; }
        public int JobRoleCategoryId { get; set; }
        public int JobGradeId { get; set; }
        public string Description { get; set; }
        public List<JobRoleBenefitDto> Benefits { get; set; }
    }
}
