

using CMS.Domain.Enum;

namespace CMS.Domain
{
    public class BusinessUnitType
    {
        public BusinessUnitTypeEnum Value { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int NumberOfDigits { get; set; }
        public int Order {  get; set; }
        public bool IsActive { get; set; }
    }
}
