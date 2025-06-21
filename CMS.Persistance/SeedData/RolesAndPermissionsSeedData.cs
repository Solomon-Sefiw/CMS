using CMS.Application.Security;
using CMS.Domain.User;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CMS.Persistence.SeedData;

public static class RolesAndPermisssionsSeedData
{
    public static async Task SeedAsync(RoleManager<HRRole> roleManager)
    {

        await CreateHRHigherOfficialRole(roleManager);
        await CreateHRSeniorOfficerRole(roleManager);
        await CreateHRDivisionManagerRole(roleManager);
        await CreateHROfficerRole(roleManager);
        await CreateHRSectionHeadRole(roleManager);
        await SystemAdminRole(roleManager);
        await CreateDistrictMakerRole(roleManager);
    }

    public static async Task CreateHRHigherOfficialRole(RoleManager<HRRole> roleManager)
    {
        var HRHigherOfficialRole = await roleManager.FindByNameAsync(Roles.HRHigherOfficial);
        if (HRHigherOfficialRole == null)
        {
            HRHigherOfficialRole = new HRRole(Roles.HRHigherOfficial, "HR Higher Official", "HR Higher Official")
            {
                Id = Guid.NewGuid().ToString()
            };
            await roleManager.CreateAsync(HRHigherOfficialRole);
        }
        var claims = await roleManager.GetClaimsAsync(HRHigherOfficialRole!);
        //Employee
        await AddClaimToRole(roleManager, HRHigherOfficialRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);
        await AddClaimToRole(roleManager, HRHigherOfficialRole, claims, CustomClaimTypes.Permission, UserPermissions.User.View);
        await AddClaimToRole(roleManager, HRHigherOfficialRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, HRHigherOfficialRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
    }

    private static async Task CreateHRSeniorOfficerRole(RoleManager<HRRole> roleManager)
    {
        var HRSeniorOfficerRole = await roleManager.FindByNameAsync(Roles.HRSeniorOfficer);
        if (HRSeniorOfficerRole == null)
        {
            HRSeniorOfficerRole = new HRRole(Roles.HRSeniorOfficer, "Senior Officer", "Senior HR Officer")
            {
                Id = Guid.NewGuid().ToString()
            };
            await roleManager.CreateAsync(HRSeniorOfficerRole);
        }
        var claims = await roleManager.GetClaimsAsync(HRSeniorOfficerRole);
        //Setup Claimes Seed for Senior Officer
        await AddClaimToRole(roleManager, HRSeniorOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, HRSeniorOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, HRSeniorOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Edit);
        await AddClaimToRole(roleManager, HRSeniorOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Edit);
        await AddClaimToRole(roleManager, HRSeniorOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Submit);
    }

    private static async Task CreateHRDivisionManagerRole(RoleManager<HRRole> roleManager)
    {
        var HRDivisionManagerRole = await roleManager.FindByNameAsync(Roles.HRDivisionManager);
        if(HRDivisionManagerRole == null)
        {
            HRDivisionManagerRole = new HRRole(Roles.HRDivisionManager, "HR Division Manager", "HR Division Manager")
            {
                Id = Guid.NewGuid().ToString()
            };
            await roleManager.CreateAsync(HRDivisionManagerRole);
        }
        var claims = await roleManager.GetClaimsAsync(HRDivisionManagerRole);
        //Setup Claimes Seed for Division Manger
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Approve);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Activate);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Activate);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.Deactivate);
        await AddClaimToRole(roleManager, HRDivisionManagerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Deactivate);

    }

    private static async Task CreateHROfficerRole(RoleManager<HRRole> roleManager)
    {
        var HROfficerRole = await roleManager.FindByNameAsync(Roles.HROfficer);
        if (HROfficerRole == null)
        {
            HROfficerRole = new HRRole(Roles.HROfficer, "Officer", "Officer")
            {
                Id = Guid.NewGuid().ToString()
            };
            await roleManager.CreateAsync(HROfficerRole);
        }
        var claims = await roleManager.GetClaimsAsync(HROfficerRole!);

        //Employee
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Edit);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.Edit);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Submit);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.View);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Submit);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Activate);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Terminate);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.View);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Submit);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Give);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Replace);
        await AddClaimToRole(roleManager, HROfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Edit);
    }

    private static async Task CreateHRSectionHeadRole(RoleManager<HRRole> roleManager)
    {
        var HRSectionHeadRole = await roleManager.FindByNameAsync(Roles.HRSectionHead);
        
        if (HRSectionHeadRole == null)
        {
            HRSectionHeadRole = new HRRole(Roles.HRSectionHead, " HR Section Head", "HR  Section Head");
            HRSectionHeadRole.Id = Guid.NewGuid().ToString();
            await roleManager.CreateAsync(HRSectionHeadRole);
        }
        var claims = await roleManager.GetClaimsAsync(HRSectionHeadRole!);

        //Employee
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Approve);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Activate);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.Deactivate);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.AddressAndContact.View);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.View);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.Probation.Approve);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.View);
        await AddClaimToRole(roleManager, HRSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.EmployeeId.Approve);
    }

    private static async Task CreateDistrictMakerRole(RoleManager<HRRole> roleManager)
    {
        var districtMakerRole = await roleManager.FindByNameAsync(Roles.DistrictMaker);

        if (districtMakerRole == null)
        {
            districtMakerRole = new HRRole(Roles.DistrictMaker, " District Maker", "District Maker");
            districtMakerRole.Id = Guid.NewGuid().ToString();
            await roleManager.CreateAsync(districtMakerRole);
        }
        var claims = await roleManager.GetClaimsAsync(districtMakerRole!);

        //Employee
        await AddClaimToRole(roleManager, districtMakerRole, claims, CustomClaimTypes.Permission, UserPermissions.Employee.PersonalInfo.View);
        await AddClaimToRole(roleManager, districtMakerRole, claims, CustomClaimTypes.Permission, UserPermissions.Setup.View);
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
    }

    private static async Task AddClaimToRole(RoleManager<HRRole> roleManager, HRRole hrRole, IList<Claim> currentClaims, string claimType, string value)
    {
        if (!currentClaims.Any(claim => claim.Type == claimType && claim.Value == value))
            await roleManager.AddClaimAsync(hrRole, new Claim(claimType, value));
    }
}
