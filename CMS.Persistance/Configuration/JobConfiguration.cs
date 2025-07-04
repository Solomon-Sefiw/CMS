using CMS.Domain;
using CMS.Domain.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class JobConfiguration : IEntityTypeConfiguration<Job>
    {
        public void Configure(EntityTypeBuilder<Job> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.BusinessUnit).WithMany().HasForeignKey(x => x.BusinessUnitId);
            builder.HasOne(x => x.JobRole).WithMany().HasForeignKey(x => x.JobRoleId);
        }
    }
}
