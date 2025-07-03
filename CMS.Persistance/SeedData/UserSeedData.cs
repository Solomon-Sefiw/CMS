using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using CMS.Domain.User;
using CMS.Persistance.DBContext;

namespace CMS.Persistence;

public static class UserSeedData
{
    public static async Task SeedAsync(UserManager<HRUser> userManager, CMSDBContext ctx)
    {
   
        var user = await userManager.FindByEmailAsync("john@test.com");
        if (user == null)
        {
            user = new HRUser()
            {
                FirstName = "Sola",
                LastName = "Sefiw",
                UserName = "solomonsefiw91@gmail.com",
                MiddleName = "Tadege",
                Email = "solomonsefiw91@gmail.com",
               // Branch = headOffice,
                TwoFactorEnabled = true,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, "Password@123");
            if (result != IdentityResult.Success)
                throw new Exception("Could not create acct for John Doe");

            result = await userManager.AddClaimAsync(user, new Claim("SystemAdmin", "true"));
            if (result != IdentityResult.Success)
                throw new Exception("Could not add SystemAdmin claim for John Doe");

          

            if (!await userManager.IsInRoleAsync(user, Roles.ITAdmin))
            {
                result = await userManager.AddToRoleAsync(user, Roles.ITAdmin);
                if (result != IdentityResult.Success)
                    throw new Exception("Could not add John Doe to IT Admin Role");
            }
            await ctx.SaveChangesAsync();
        }

  
    }
}
