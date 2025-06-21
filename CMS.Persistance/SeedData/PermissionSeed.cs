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

            // Extract permissions for Employee - PersonalInfo
            permissions.AddRange(new[]
            {
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.View, ClaimCategory = ClaimCategory.EmployeePersonalInfo },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.Edit, ClaimCategory = ClaimCategory.EmployeePersonalInfo  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.Approve, ClaimCategory = ClaimCategory.EmployeePersonalInfo  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.Submit, ClaimCategory = ClaimCategory.EmployeePersonalInfo  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.Activate, ClaimCategory = ClaimCategory.EmployeePersonalInfo  },
                    new Permission { Id = Guid.NewGuid(), ClaimValue = UserPermissions.Employee.PersonalInfo.Deactivate, ClaimCategory = ClaimCategory.EmployeePersonalInfo  },

                });



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

            // Extract permissions for Probation
            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.Probation.View, ClaimCategory = ClaimCategory.EmployeeProbation },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.Probation.Approve, ClaimCategory = ClaimCategory.EmployeeProbation},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.Probation.Submit, ClaimCategory = ClaimCategory.EmployeeProbation},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.Probation.Terminate, ClaimCategory = ClaimCategory.EmployeeProbation},
            });
            // Extract permissions for Address and Contact
            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.View, ClaimCategory = ClaimCategory.AddressAndContact },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Edit, ClaimCategory = ClaimCategory.AddressAndContact},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Activate, ClaimCategory = ClaimCategory.AddressAndContact},
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.AddressAndContact.Deactivate, ClaimCategory = ClaimCategory.AddressAndContact},
            });
            // Extract permissions for Employee Id
            permissions.AddRange(new[]
            {
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.View, ClaimCategory = ClaimCategory.EmployeeId },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.Edit, ClaimCategory = ClaimCategory.EmployeeId },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.Approve, ClaimCategory = ClaimCategory.EmployeeId },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.Submit, ClaimCategory = ClaimCategory.EmployeeId },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.Give, ClaimCategory = ClaimCategory.EmployeeId },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Employee.EmployeeId.Replace, ClaimCategory = ClaimCategory.EmployeeId },

            });
            permissions.AddRange(new[]
{
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View1, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View2, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View3, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View4, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View5, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View6, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View7, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View8, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View9, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View10, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View11, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View12, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View13, ClaimCategory = ClaimCategory.Dashboard },
                new Permission {Id = Guid.NewGuid(),ClaimValue = UserPermissions.Dashboard.View14, ClaimCategory = ClaimCategory.Dashboard },

            });

            // Add the permissions to the context and save them to the database
            await context.Permissions.AddRangeAsync(permissions);

        }
    }
}

