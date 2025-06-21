
using CMS.Domain;
using CMS.Domain.Enum;

namespace CMS.Domain.Adress
{
    public class Address
    {
        public int Id { get; set; }
        public AddressTypeEnum AddressType { get; set; } // "Chartered" or "NonChartered"
        public CountryEnum Country { get; set; }

        // For non-chartered cities
        public int? RegionId { get; set; }
        public Region Region { get; set; }  // with City Admin

        // For chartered cities
        public int? SubCityId { get; set; }
        public SubCity SubCity { get; set; }  //Zone

        // Common fields for both
        public string City { get; set; }
        public string Woreda { get; set; }

        public string? Kebele { get; set; }
        public string? HouseNumber { get; set; }

        // RelationShip
        public int RequestId { get; set; }

        public DateTime RegisteredOn { get; set; }

    }

}
