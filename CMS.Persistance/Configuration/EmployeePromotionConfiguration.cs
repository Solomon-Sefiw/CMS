using System.Reflection.Emit;
using CMS.Domain;
using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeePromotionConfiguration : IEntityTypeConfiguration<EmployeePromotion>
    {
        public void Configure (EntityTypeBuilder<EmployeePromotion> builder)
        {
        
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.BusinessUnitAfter).WithMany().HasForeignKey(x => x.BusinessUnitAfterId)
            .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.BusinessUnitBefore).WithMany().HasForeignKey(x => x.BusinessUnitBeforeId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.JobRoleBefore).WithMany().HasForeignKey(x => x.JobRoleBeforeId)
               .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.JobRoleAfter).WithMany().HasForeignKey(x => x.JobRoleAfterId).OnDelete(DeleteBehavior.Restrict);

        }
    }
}
