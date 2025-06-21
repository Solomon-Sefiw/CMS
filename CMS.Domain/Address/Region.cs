

using CMS.Domain.Adress;
using CMS.Domain.Enum;

namespace CMS.Domain.Adress
{
    public class Region
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<SubCity> SubCities { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    }

}
