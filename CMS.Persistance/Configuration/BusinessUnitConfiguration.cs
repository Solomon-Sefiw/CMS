using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace CMS.Persistance.Configuration
{
    public class BusinessUnitConfiguration : IEntityTypeConfiguration<BusinessUnit>
    {
        public void Configure (EntityTypeBuilder<BusinessUnit> builder)
        {
            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));
            builder.HasKey(x => x.Id);
            builder.HasOne(x=>x.BusinessUnitType).WithMany().HasForeignKey(x => x.Type);
        }
    }
}
