using System.Reflection.Emit;
using CMS.Domain;
using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeeReClassificationConfiguration : IEntityTypeConfiguration<EmployeeReClassification>
    {
        public void Configure (EntityTypeBuilder<EmployeeReClassification> builder)
        {
        
            builder.HasKey(x => x.Id);
              builder.HasOne(x => x.JobRoleBefore).WithMany().HasForeignKey(x => x.JobRoleBeforeId)
               .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.JobRoleAfter).WithMany().HasForeignKey(x => x.JobRoleAfterId).OnDelete(DeleteBehavior.Restrict);

        }
    }
}
