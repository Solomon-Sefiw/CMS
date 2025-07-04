using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class JobGradeConfiguration:IEntityTypeConfiguration<JobGrade>
    {
        public void Configure (EntityTypeBuilder<JobGrade> builder)
        {
            builder.HasKey(x => x.JobGradeId);
            builder.Property(x => x.Name).HasConversion<string>();
        }
    }
}
