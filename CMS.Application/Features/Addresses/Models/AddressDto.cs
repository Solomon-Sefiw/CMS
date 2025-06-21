using CMS.Domain.Adress;
using CMS.Domain;
using CMS.Domain.Enum;

public record AddressDto(
    int Id,
    AddressTypeEnum AddressType,
    CountryEnum Country,
    int? RegionId,
    string? RegionName,
    int? SubCityId,
    string? SubCityName,
    string Woreda,
    string City,
    string? Kebele,
    string? HouseNumber,
    int RequestId,
    DateTime RegisteredOn
)
{
  
}
