using CMS.Domain.User;

namespace CMS.Api.Dto
{
    public class CreateRoleDto
    {
            public HRRole Role { get; set; }
            public List<string> PermissionNames { get; set; } // List of permission claim values
    }
}
