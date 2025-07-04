using CMS.Application.Features.Benefits.Model;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Jobs.JobRoles
{
    public class JobRoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public string JobCatagory {  get; set; }
        public JobGradeRomanId JobGrade { get; set; }
        public string JobRoleCatagory { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public ActivationEnum IsActive { get; set; }

        public List<JobRoleBenefitDto> Benefits { get; set; }
    }
}
