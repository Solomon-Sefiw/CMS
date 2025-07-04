using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public class JobRoleCatagorySeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.JobRoleCatagories.Any()) return;
            var jobRoleCategory = new List<JobRoleCategory>()
            {
                new JobRoleCategory() {Name="Officer",Description = "Officer"},
                new JobRoleCategory() {Name="Acting",Description = "Acting"},
                new JobRoleCategory() {Name="Branch Manager", Description = "Branch Manager"},
                new JobRoleCategory() {Name="Division Manager", Description = "Division Manager"},
                new JobRoleCategory() {Name="Department-Director", Description = "Department-Director"},
                new JobRoleCategory() {Name="CEO Bank Hierarchy", Description = "CEO Bank Hierarchy"},
                new JobRoleCategory() {Name="Section Head", Description = "Section Head"},
            };
            await context.JobRoleCatagories.AddRangeAsync(jobRoleCategory);
        }
    }
}
