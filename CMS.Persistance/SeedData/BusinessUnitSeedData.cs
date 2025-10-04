
using Azure.Core;
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public class BusinessUnitSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.BusinessUnits.Any()) return;

            var region = new Region
            {
                Name = "Addis Ababa",
                Description = "Addis Ababa Region",
                ApprovalStatus = ApprovalStatus.Approved,
            };
            context.Regions.Add(region);
            await context.SaveChangesAsync();

            var subCity = new SubCity
            {
                Name = "Bole",
                RegionId = region.Id,
                Description = "Bole SubCity",
                ApprovalStatus = ApprovalStatus.Approved

            };
            context.SubCities.Add(subCity);
            await context.SaveChangesAsync();


            var businessUnits = new BusinessUnit() { Name = "FederalSuperemeSeber", BusinessUnitID = "FederalSuperemeSeber",
                BusinessUnitCode = "01", ParentId = 1, Type = BusinessUnitTypeEnum.FederalSuperemeSeber
            };
            context.BusinessUnits.Add(businessUnits);
            await context.SaveChangesAsync();

            var address = new Address
            {
                AddressType = AddressTypeEnum.BusinessUnitAddress,
                Country = CountryEnum.Ethiopia,
                RegionId = region.Id,
                SubCityId = subCity.Id,
                Woreda = "07",
                City = "Addis Ababa",
                Kebele = "01",
                RequestId = businessUnits.Id,
                

            };
            context.Addresses.Add(address);
            await context.SaveChangesAsync();
        }
    }
}
