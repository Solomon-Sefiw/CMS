using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using CMS.Domain.Employee;

namespace CMS.Persistance.Configuration
{
    public class EmployeeChangeLogConfigurations : IEntityTypeConfiguration<EmployeeChangeLog>
    {
        public void Configure(EntityTypeBuilder<EmployeeChangeLog> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));

            builder.Property(x => x.EntityType).HasConversion<string>();
            builder.Property(x => x.ChangeType).HasConversion<string>();
        }
    }
}