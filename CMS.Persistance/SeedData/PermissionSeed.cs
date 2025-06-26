using CMS.Application.Security;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public class PermissionSeed
    {
        public static async Task SeedPermissionsAsync(CMSDBContext context)
        {
            if (context.Permissions.Any()) return;

            var permissions = new List<Permission>();



            // Extract permissions for User Management
            permissions.AddRange(new[]
            {
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.User.View, ClaimCategory = ClaimCategory.User },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.User.Edit, ClaimCategory = ClaimCategory.User  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.User.Disable, ClaimCategory = ClaimCategory.User  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.User.Enable, ClaimCategory = ClaimCategory.User  }
                });
            // Extract permissions for Setup
            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.View, ClaimCategory = ClaimCategory.Setup },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.Edit, ClaimCategory = ClaimCategory.Setup  },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.Submit, ClaimCategory = ClaimCategory.Setup },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.Approve, ClaimCategory = ClaimCategory.Setup },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.Activate, ClaimCategory = ClaimCategory.Setup },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Setup.Deactivate, ClaimCategory = ClaimCategory.Setup },
            });

            // Extract permissions for Address and Contact
            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.View, ClaimCategory = ClaimCategory.AddressAndContact },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Edit, ClaimCategory = ClaimCategory.AddressAndContact},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Activate, ClaimCategory = ClaimCategory.AddressAndContact},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Deactivate, ClaimCategory = ClaimCategory.AddressAndContact},
            });

            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View1, ClaimCategory = ClaimCategory.Dashboard },

            });
            // Add the permissions to the context and save them to the database
            await context.Permissions.AddRangeAsync(permissions);

        }
    }
}

