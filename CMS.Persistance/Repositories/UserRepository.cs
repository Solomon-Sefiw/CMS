using CMS.Application;
using CMS.Application.Models;
using CMS.Domain.User;
using CMS.Persistance.DBContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RequestDecompression;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CMS.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly CMSDBContext dbContext;
    private readonly RoleManager<HRRole> roleManager;

    public UserRepository(CMSDBContext dbContext,RoleManager<HRRole> roleManager)
    {
        this.dbContext = dbContext;
        this.roleManager = roleManager;
    }
    public Task ForgetPasswordAsync()
    {
        throw new NotImplementedException();
    }

    public Task LoginAsync()
    {
        throw new NotImplementedException();
    }

    public void RegisterUser()
    {

    }
    public Task RegisterUserAsync()
    {
        throw new NotImplementedException();
    }

    public Task ResetPasswordAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<List<UserDetail>> GetAllUsers()
    {


        var result = await dbContext.Users
           .Include(u => u.Roles)
        //    .Include(u => u.Claims)
           .ToListAsync();

        var roles = await GetAllRoles();

        return result.Select(user => MapSMSUserToUserDetail(user, roles)).ToList();
    }



    public async Task<UserDetail> GetUserById(string userId)
    {
        var user = await dbContext.Users
            .Include(u => u.Roles)
            // .Include(u => u.Claims)
            .FirstOrDefaultAsync(u => u.Id == userId);

        var roles = await GetAllRoles();

        if (user == null)
            return null;

        return MapSMSUserToUserDetail(user, roles);
    }

    public async Task<RoleDetail> GetRoleById(string roleId)
    {
        var role = await dbContext.Roles
            .Include(u => u.Claims)
            .FirstOrDefaultAsync(u => u.Id == roleId);

        var roleClaimsQuery = new List<RoleWithClaimsDto>();

            var roleClaims = await roleManager.GetClaimsAsync(role);

            var roleWithClaims = new RoleWithClaimsDto
            {
                RoleId = role.Id,
                RoleName = role.Name,
                Claims = roleClaims.Select(c => new Claim
                {
                    ClaimType = c.Type,
                    ClaimValue = c.Value
                }).ToList()
            };

            roleClaimsQuery.Add(roleWithClaims);



        var claims = await GetAllClaims();

        if (role == null)
            return null;

        return MapCMSRoleToRoleDetail(roleWithClaims, claims);
    }

    public async Task<List<PermissionClaim>> GetAllClaims()
    {
        return await dbContext.Permissions.Select(r => new PermissionClaim
        {
            Id = r.Id,
            ClaimValue = r.ClaimValue,
        }).ToListAsync();
    }
    public async Task<List<Role>> GetAllRoles()
    {
        return await dbContext.Roles.Select(r => new Role
        {
            Id = r.Id,
            Name = r.Name,
            DisplayName = r.DisplayName,
            Description = r.Description
        }).ToListAsync();
    }

    private UserDetail MapSMSUserToUserDetail(HRUser user, List<Role>? roles) =>
        new UserDetail
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            MiddleName = user.MiddleName,
            BranchId = user.BranchId,
            Roles = roles?.Where(r => user.Roles.Select(r => r.RoleId).Contains(r.Id)).ToList(),
            Email = user.Email,
            AccessFailedCount = user.AccessFailedCount,
            Claims = new List<Claim>(),
            IsDeactivated = user.IsDeactivated
        };

    private RoleDetail MapCMSRoleToRoleDetail(RoleWithClaimsDto role, List<PermissionClaim>? claims) =>
        new RoleDetail
        {
            Id = role.RoleId,
            Name = role.RoleName,
            permissionClaims = claims?.Where(r => role.Claims.Select(r => r.ClaimValue).Contains(r.ClaimValue)).ToList(),
           
        };
}