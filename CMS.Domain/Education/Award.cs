using CMS.Domain.Enum;

namespace CMS.Domain.Education.awards
{
    public class Award
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation property for the one-to-one relationship (optional, depending on which side owns the FK)
        public ICollection<Education> Educations { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    }
}