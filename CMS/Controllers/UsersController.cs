using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application;
using CMS.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController<UsersController>
    {
        private readonly IIdentityService identityService;
        private readonly UserManager<HRUser> userManager;
        private readonly RoleManager<HRRole> roleManager;
        public UsersController(IIdentityService identityService,UserManager<HRUser> userManager,
            RoleManager<HRRole> roleManager) : base()
        {
            this.identityService = identityService;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

         [Authorize]
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<UserDto> CurrentUserInfo()
        {
            var currentUserId = CurrentUser.Id;

            var user = await userManager.Users
                .Include(u => u.Roles)  // Include the user's roles
                .SingleOrDefaultAsync(u => u.Id == currentUserId);

            if (user == null)
            {
                return null; 
            }

            var userRoles = await userManager.GetRolesAsync(user);

            var permissions = new List<Permission>();

            foreach (var roleName in userRoles)
            {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    // Get the claims attached to this role
                    var roleClaims = await roleManager.GetClaimsAsync(role);

                    // For each claim, check if it is a policy we need to assign
                    foreach (var claim in roleClaims)
                    {
                        // Check if the claim corresponds to a policy
                        permissions.Add(new Permission
                        {
                            Name = claim.Value,  
                            HasPermission = true 
                        });
                    }
                }
            }

            CurrentUser.Roles = userRoles.ToList();
            CurrentUser.Permissions = permissions;

            return CurrentUser;
        }
    }
}
