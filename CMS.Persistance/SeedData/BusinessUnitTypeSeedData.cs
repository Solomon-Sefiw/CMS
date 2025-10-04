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
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.FederalSuperemeSeber, Name = "FederalSuperemeSeber", Description = "Federal Supereme Seber", NumberOfDigits = 2, Order = 0, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.FederalSupermeCourt, Name = "FederalSupermeCourt", Description = "Federal Superme Court", NumberOfDigits = 2, Order = 1, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.RegionalSeber, Name = "RegionalSeber", Description = "Regional Seber", NumberOfDigits = 2, Order = 2, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.RegionalSupermeCourt, Name = "RegionalSupermeCourt", Description = "Regional Superme Court", NumberOfDigits = 2, Order = 3, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.ZonalHighCourt, Name = "ZonalHighCourt", Description = "Zonal High Court", NumberOfDigits = 2, Order = 4, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.WeredaCourts, Name = "WeredaCourts", Description = "Wereda Courts", NumberOfDigits = 2, Order = 5, IsActive = true },
                new BusinessUnitType() { Value = BusinessUnitTypeEnum.MahiberawiCourt, Name = "MahiberawiCourt", Description = "Mahiberawi Court", NumberOfDigits = 2, Order = 6, IsActive = true }
            };
            await context.BusinessUnitTypes.AddRangeAsync(businessUnitTypes);
        }
    }
}
