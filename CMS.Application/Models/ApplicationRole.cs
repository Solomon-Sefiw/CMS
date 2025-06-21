using Microsoft.AspNetCore.Identity;

namespace CMS.Application.Models;

public class  ApplicationRole
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string DisplayName { get; set; }
    public string Description { get; set; }
    public ICollection<IdentityRoleClaim<string>>? Claims { get; set; }
}

public class RoleWithClaimsDto
{
    public string RoleId { get; set; }
    public string RoleName { get; set; }
    public List<Claim> Claims { get; set; }
}