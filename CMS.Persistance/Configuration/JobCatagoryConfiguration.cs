using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class JobCatagoryConfiguration:IEntityTypeConfiguration<JobCatagory>
    {
        public void Configure (EntityTypeBuilder<JobCatagory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.JobCategoryName).HasConversion<string>();
        }
    }
}
