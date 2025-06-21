using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public class BusinessUnitTypeSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.BusinessUnitTypes.Any()) return;
            var businessUnitTypes = new List<BusinessUnitType>()
            {
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.FederalSupremeCourt, Name = "FederalSupremeCourt", Description = "Federal Supreme Court", NumberOfDigits = 2, Order = 0, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.FederalHighCourt, Name = "FederalHighCourt", Description = "Federal High Court", NumberOfDigits = 2, Order = 1, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.FederalFirstInstanceCourt, Name = "FederalFirstInstanceCourt", Description = "Federal First Instance Court", NumberOfDigits = 2, Order = 2, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.RegionalSupremeCourt, Name = "RegionalSupremeCourt", Description = "Regional Supreme Court", NumberOfDigits = 2, Order = 3, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.RegionalHighCourt, Name = "RegionalHighCourt", Description = "Regional High Court", NumberOfDigits = 2, Order = 4, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.RegionalFirstInstanceCourt, Name = "RegionalFirstInstanceCourt", Description = "Regional First Instance Court", NumberOfDigits = 2, Order = 5, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.ZonalCourt, Name = "ZonalCourt", Description = "Zonal Court", NumberOfDigits = 2, Order = 6, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.WoredaOrSubCityCourt, Name = "WoredaOrSubCityCourt", Description = "Woreda or Sub-City Court", NumberOfDigits = 3, Order = 7, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.CourtDivision, Name = "CourtDivision", Description = "Court Division", NumberOfDigits = 2, Order = 8, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.CourtSection, Name = "CourtSection", Description = "Court Section", NumberOfDigits = 2, Order = 9, IsActive = true },
            };
            await context.BusinessUnitTypes.AddRangeAsync(businessUnitTypes);
        }
    }
}
