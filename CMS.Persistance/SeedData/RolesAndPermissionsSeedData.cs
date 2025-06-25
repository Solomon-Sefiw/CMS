using CMS.Application.Security;
using CMS.Domain.User;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CMS.Persistence.SeedData;

public static class RolesAndPermisssionsSeedData
{
    public static async Task SeedAsync(RoleManager<HRRole> roleManager)
    {
        await SystemAdminRole(roleManager);
    }

    private async static Task SystemAdminRole(RoleManager<HRRole> roleManager)
    {
        var systemAdminRole = await roleManager.FindByNameAsync(Roles.ITAdmin);
        if (systemAdminRole == null)
        {
            systemAdminRole = new HRRole(Roles.ITAdmin, "IT Admin", "IT Admin");
            await roleManager.CreateAsync(systemAdminRole);
        }
        var claims = await roleManager.GetClaimsAsync(systemAdminRole!);

        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Disable);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Enable);
        //Setup
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Approve);
        await AddClaimToRole(roleManager,systemAdminRole, claims, CustomClaimTypes.Permission,UserPermissions.Setup.Activate);
        await AddClaimToRole(roleManager,systemAdminRole, claims,CustomClaimTypes.Permission,UserPermissions.Setup.Deactivate);
        //AddressAndContact
        await AddClaimToRole(roleManager,systemAdminRole, claims,CustomClaimTypes.Permission,UserPermissions.AddressAndContact.View); 
        await AddClaimToRole(roleManager,systemAdminRole, claims,CustomClaimTypes.Permission,UserPermissions.AddressAndContact.Edit); 
        await AddClaimToRole(roleManager,systemAdminRole, claims,CustomClaimTypes.Permission,UserPermissions.AddressAndContact.Activate); 
        await AddClaimToRole(roleManager,systemAdminRole, claims,CustomClaimTypes.Permission,UserPermissions.AddressAndContact.Deactivate);
        //Dashboard
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View1);
    }

    private static async Task AddClaimToRole(RoleManager<HRRole> roleManager, HRRole hrRole, IList<Claim> currentClaims, string claimType, string value)
    {
        if (!currentClaims.Any(claim => claim.Type == claimType && claim.Value == value))
            await roleManager.AddClaimAsync(hrRole, new Claim(claimType, value));
    }
}
