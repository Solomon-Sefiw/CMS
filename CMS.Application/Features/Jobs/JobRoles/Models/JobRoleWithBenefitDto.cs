using CMS.Application.Features.Benefits.Model;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobRoles.Models
{
    public class JobRoleWithBenefitDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int JobCatagoryId { get; set; }
        public int JobGradeId { get; set; }
        public int JobRoleCategoryId { get; set; }

        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public ActivationEnum IsActive { get; set; }

        public List<JobRoleBenefitDto> Benefits { get; set; }
    }
}
