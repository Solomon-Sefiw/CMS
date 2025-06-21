
using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));
            builder.Property(x => x.EmployeeId)
                .IsRequired()
                .HasDefaultValueSql("NEXT VALUE FOR EMPLOYEEID");
            builder.HasIndex(X => X.EmployeeId).IsUnique(true).IsClustered(false);
        }
    }
}
