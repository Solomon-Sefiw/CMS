using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class JobTitleConfiguration:IEntityTypeConfiguration<JobRole>
    {
        public void Configure (EntityTypeBuilder<JobRole> builder)
        {
            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.JobGrade).WithMany().HasForeignKey(x => x.JobGradeId);
            builder.HasOne(x => x.JobCatagory).WithMany().HasForeignKey(x => x.JobCatagoryId);
 
        }
    }
}
