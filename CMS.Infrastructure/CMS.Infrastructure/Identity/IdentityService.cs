using CMS.Application;
using CMS.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace CMS.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<HRUser> userManager;
        private readonly RoleManager<HRRole> roleManager;
        private readonly IUserClaimsPrincipalFactory<HRUser> userClaimsPrincipalFactory;
        private readonly IAuthorizationService authorizationService;

        public IdentityService(
            UserManager<HRUser> userManager,RoleManager<HRRole> roleManager,
            IUserClaimsPrincipalFactory<HRUser> userClaimsPrincipalFactory,
            IAuthorizationService authorizationService)
        {
            this.userManager = userManager;
            this.userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            this.authorizationService = authorizationService;
            this.roleManager = roleManager;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);

            return user != null && await userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            var principal = await userClaimsPrincipalFactory.CreateAsync(user);

            var result = await authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task<IList<string>> GetUserRoles(string userId)
        {

            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);
            if (user == null) return null;
            var role= await userManager.GetRolesAsync(user);
            //var claim = await roleManager.GetClaimsAsync(role);
            return role;
        }

        public async Task<bool> HasPermission(string userId, string policyName)
        {
            try
            {
                // Fetch the user from the database
                var user = await userManager.Users.Include(u => u.Roles) // Include roles in the query
                                                  .SingleOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return false;
                }

                // Get the roles assigned to the user
                var userRoles = await userManager.GetRolesAsync(user);

                // Now, we will check the claims attached to each role
                foreach (var roleName in userRoles)
                {
                    var role = await roleManager.FindByNameAsync(roleName);
                    if (role != null)
                    {
                        // Fetch the claims attached to the role
                        var roleClaims = await roleManager.GetClaimsAsync(role);

                        // Check if the role has the claim associated with the policy
                        foreach (var claim in roleClaims)
                        {
                            if (claim.Value == policyName)
                            {
                                return true; // User has the permission (claim)
                            }
                        }
                    }
                }

                return false; // User doesn't have the permission
            }
            catch (Exception ex)
            {
                // Log error or handle as needed
                return false;
            }
        }

    }
}
