
using CMS.Domain.User;
using CMS.Persistance.DBContext;
using CMS.Persistence;
using CMS.Persistence.SeedData;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;


namespace CMS.Persistance.SeedData
{
    public class Seed
    {
  
        public static async Task SeedData (CMSDBContext context,UserManager <HRUser> userManager, RoleManager<HRRole> roleManager)
        {
      
            await PermissionSeed.SeedPermissionsAsync(context);
            await RolesAndPermisssionsSeedData.SeedAsync(roleManager);
            await EmailTempleteSeedData.SeedAsync(context);
            await UserSeedData.SeedAsync (userManager,context);
            await BusinessUnitTypeSeedData.SeedAsync(context);
            await BusinessUnitSeedData.SeedAsync(context);
            await context.SaveChangesAsync ();

        }
    }
}
