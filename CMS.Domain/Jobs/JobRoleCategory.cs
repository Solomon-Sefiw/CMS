using System.ComponentModel.DataAnnotations;
using CMS.Domain.Enum;

namespace CMS.Domain
{
    public class JobRoleCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<JobRole> JobRoles { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
    }
}
