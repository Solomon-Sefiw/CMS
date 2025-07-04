using CMS.Domain.Enum;

namespace CMS.Application.Features.Educations.Setups.Award.Models
{
    public class AwardDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
    }
}