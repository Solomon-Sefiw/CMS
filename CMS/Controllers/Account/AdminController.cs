using CMS.Api.Dto;
using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application;
using CMS.Application.Features.User.Queries;
using CMS.Application.Features.UserAccount.Queries;
using CMS.Application.Models;
using CMS.Application.Security;
using CMS.Domain.Enum;
using CMS.Domain.User;
using CMS.Persistance.DBContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Claim = System.Security.Claims.Claim;

namespace CMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : BaseController<AdminController>
{
    private readonly UserManager<HRUser> userManager;
    private readonly IConfiguration configuration;
    private readonly RoleManager<HRRole> roleManager;
    private readonly CMSDBContext cMSDBContext;
    public AdminController(UserManager<HRUser> userManager, IConfiguration configuration,
        RoleManager<HRRole> roleManager,CMSDBContext cMSDBContext) : base()
    {
        this.userManager = userManager;
        this.configuration = configuration;
        this.roleManager = roleManager;
        this.cMSDBContext = cMSDBContext;
    }

  
    [HttpPost("create-role")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(201)] // Created
    [ProducesResponseType(400)] // Bad Request
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<HRRole>> CreateRole([FromBody] CreateRoleDto createRoleDto)
    {
        if (string.IsNullOrEmpty(createRoleDto.Role.Name) || string.IsNullOrEmpty(createRoleDto.Role.DisplayName)
            || string.IsNullOrEmpty(createRoleDto.Role.Description))
        {
            return BadRequest("Role name, display name, and description are required.");
        }
        // Check if role already exists
        var existingRole = await roleManager.FindByNameAsync(createRoleDto.Role.Name);
        if (existingRole != null)
        {
            return BadRequest($"Role with name {createRoleDto.Role.Name} already exists.");
        }
        // Begin a transaction
        using (var transaction = await cMSDBContext.Database.BeginTransactionAsync())
        {
            try
            {
                // Create a new role
                var newRole = new HRRole(createRoleDto.Role.Name, createRoleDto.Role.DisplayName, createRoleDto.Role.Description)
                {
                    Id = Guid.NewGuid().ToString()
                };
                var result = await roleManager.CreateAsync(newRole);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(result.Errors);
                }
                var permissionClaims = await cMSDBContext.Permissions
                    .Where(p => createRoleDto.PermissionNames.Contains(p.ClaimValue))
                    .ToListAsync();
                var claims = await roleManager.GetClaimsAsync(newRole);

                foreach (var permission in permissionClaims)
                {
                    if (!claims.Any(c => c.Value == permission.ClaimValue))
                    {
                        await AddClaimToRole(newRole, permission.ClaimValue);
                    }
                    else
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Claim {permission.ClaimValue} already selected!");
                    }
                }

                await transaction.CommitAsync();
                var newRoles = CreatedAtAction(nameof(CreateRole), new { id = newRole.Id }, newRole);
                return newRoles;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }


    private async Task AddClaimToRole(HRRole role, string permission)
    {
        var claim = new Claim(CustomClaimTypes.Permission, permission);
        await roleManager.AddClaimAsync(role, claim);
    }

    private async Task RemoveClaimFromRole(HRRole role, string permission)
    {
        var claim = new Claim(CustomClaimTypes.Permission, permission);
        await roleManager.RemoveClaimAsync(role, claim);
    }


    [HttpGet("permissions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<List<PermissionClaim>>> GetPermissions()
    {
        var permissions = await cMSDBContext.Permissions.ToListAsync();
        return Ok(permissions);
    }



    [HttpPost("register-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<HRUser>> RegisterUser(RegisterDto registerDto)
    {
        //TODO: validate
        var user = new HRUser()
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            MiddleName = registerDto.MiddleName,
            LastName = registerDto.LastName,
            BranchId = registerDto.BranchId,
            EmailConfirmed = true,
            TwoFactorEnabled = true
        };

        var random = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var password = new string(Enumerable.Repeat(chars, random.Next(8, 12))
            .Select(s => s[random.Next(s.Length)]).ToArray());

        while (!password.Any(char.IsDigit))
        {
            password = password + new string(Enumerable.Repeat("0123456789", random.Next(1, 3))
           .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        var result = await userManager.CreateAsync(user, password);

        if (registerDto.Roles?.Count() > 0)
        {
            await userManager.AddToRolesAsync(user, registerDto.Roles);
        }

        if (result.Succeeded)
        {
            await mediator.Send(new CreateEmailNotificationCommand()
            {
                Notification = new EmailNotification()
                {
                    ToEmail = user.Email,
                    ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    EmailType = EmailTypeEnum.AppUserCreated,
                    Subject = "Account Created",
                    Model = new
                    {
                        Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                        SmsUrl = configuration.GetValue<string>("AppUrl"),
                        TempPassword = password
                    }
                }
            });

            return Ok(user);
        }
        var errors = result.Errors.Where(e => e.Code != "DuplicateUserName")
                                  .Select(error => new { error.Code, error.Description })
                                  .ToDictionary(t => t.Code, t => t.Description);

        return BadRequest(errors);

    }

    [HttpPost("user/add-claims")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<UserDto>> AddClaims(string userId, [FromBody] Dictionary<string, string> claims)
    {

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return BadRequest();
        }

        var currentClaims = await userManager.GetClaimsAsync(user) ?? new List<Claim>();

        var newClaimsToAdd = claims.ToList().Where(claim => !currentClaims.Any(c => c.Value == claim.Value)).Select(c => new Claim(c.Key, c.Value));

        if (newClaimsToAdd?.Count() > 0)
        {
            var result = await userManager.AddClaimsAsync(user, newClaimsToAdd);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                throw new Exception($"Unable to add claims to user: {user.Email} ");
            }

        }

        return Ok();
    }

    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<List<UserDetail>>> Users()
    {
        var users = await mediator.Send(new GetAllUsersQuery());
        return Ok(users);
    }

    [HttpGet("users/:id")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<UserDetail>> GetUserDetail(string id)
    {
        var user = await mediator.Send(new GetUserDetailQuery(id));
        return Ok(user);
    }

    [HttpGet("roles/:id")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<RoleDetail>> GetRoleDetail(string id)
    {
        var user = await mediator.Send(new GetRoleDetailQuery(id));
        return Ok(user);
    }

    [HttpPost("users/:id/:role")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<UserDetail>> AddUserRole(string id, string role)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return BadRequest();
        if (!await userManager.IsInRoleAsync(user, role))
            await userManager.AddToRoleAsync(user, role);

        return Ok();
    }

    [HttpPost("roles/:id/:claim")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<RoleDetail>> AddRoleClaim(string id, string claim)
    {
        var roles = await roleManager.FindByIdAsync(id);
        if (roles == null)
        {
            return BadRequest();
        }
        await AddClaimToRole(roles, claim);

        return Ok();
    }


    [HttpDelete("users/:id/:role")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<UserDetail>> RemoveUserRole(string id, string role)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return BadRequest();
        if (await userManager.IsInRoleAsync(user, role))
            await userManager.RemoveFromRoleAsync(user, role);

        return Ok();
    }


    [HttpDelete("roles/:id/:claim")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Authorize(Policy = AuthPolicy.User.canCreateUpdateUser)]
    public async Task<ActionResult<RoleDetail>> RemoveRoleClaim(string id, string claim)
    {
        var role = await roleManager.FindByIdAsync(id);
        if (role == null)
            return BadRequest();

        await RemoveClaimFromRole(role, claim);

        return Ok();
    }



    [HttpGet("roles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<List<ApplicationRole>>> GetRoles()
    {
        var users = await mediator.Send(new GetAllRolesQuery());
        return Ok(users);
    }

    [HttpGet("role-claims")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Policy = AuthPolicy.User.canViewUser)]
    public async Task<ActionResult<List<RoleWithClaimsDto>>> GetRoleClaim()
    {
        var roles=await mediator.Send(new GetRoleClaimsQuery());
        return Ok(roles);
        // Get all roles from the RoleManager
       
    }
}
