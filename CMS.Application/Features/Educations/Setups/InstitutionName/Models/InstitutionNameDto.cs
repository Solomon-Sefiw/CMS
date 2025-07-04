using CMS.Domain.Enum;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Models
{
   public class InstitutionNameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

    }
}
