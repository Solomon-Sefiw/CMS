using CMS.Domain.Enum;

namespace CMS.Domain.Education
{
    public class FieldOfStudy
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<Education> Educations { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    }
}