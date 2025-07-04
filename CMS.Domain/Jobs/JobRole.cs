using CMS.Domain.Benefit;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CMS.Domain
{
    public class JobRole
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int JobCatagoryId {  get; set; }
        public int JobRoleCategoryId { get; set; } // Foreign Key
        public JobRoleCategory JobRoleCategory { get; set; }
        public int JobGradeId { get; set; }
        public JobGrade JobGrade { get; set; }
        public JobCatagory JobCatagory { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public string? StatusRemark  { get; set; }
        public ActivationEnum IsActive { get; set; }
        public ICollection<JobRoleBenefit> JobRoleBenefits { get; set; } = new List<JobRoleBenefit>();

    }
}
