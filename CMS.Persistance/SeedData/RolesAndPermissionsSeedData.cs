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
        await JudgeRole(roleManager);
    }

    private async static Task JudgeRole(RoleManager<HRRole> roleManager)
    {
        var judgeRole = await roleManager.FindByNameAsync(Roles.Judge);
        if (judgeRole == null)
        {
            judgeRole = new HRRole(Roles.Judge, "Judge", "Judge");
            await roleManager.CreateAsync(judgeRole);
        }
        var claims = await roleManager.GetClaimsAsync(judgeRole!);

        //Employee
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Edit);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);

        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Edit);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Disable);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.User.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Enable);
        //Setup
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Edit);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Approve);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Activate);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Deactivate);
        //Letter
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Edit);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Approve);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Activate);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Deactivate);
        //AddressAndContact
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Edit);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Activate);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Deactivate);
        //Dashboard
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View1);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View1);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View2);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View3);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View4);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View5);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View6);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View7);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View8);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View9);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View10);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View11);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View12);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View13);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View14);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View15);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View16);
        //Probation
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Approve);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.View);
        await AddClaimToRole(roleManager, judgeRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Approve);

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

        //Employee
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);

        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Disable);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Enable);
        //Setup
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Approve);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Activate);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Deactivate);
        //Letter
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Approve);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Activate);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Letter.Deactivate);
        //AddressAndContact
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Activate);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Deactivate);
        //Dashboard
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View1);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View1);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View2);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View3);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View4);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View5);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View6);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View7);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View8);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View9);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View10);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View11);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View12);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View13);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View14);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View15);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Dashboard.View16);
        //Probation
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Approve);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Approve);

    }

    private static async Task AddClaimToRole(RoleManager<HRRole> roleManager, HRRole hrRole, IList<Claim> currentClaims, string claimType, string value)
    {
        if (!currentClaims.Any(claim => claim.Type == claimType && claim.Value == value))
            await roleManager.AddClaimAsync(hrRole, new Claim(claimType, value));
    }
}
