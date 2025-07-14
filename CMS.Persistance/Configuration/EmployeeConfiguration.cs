//using CMS.Domain.Employee;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace CMS.Persistance.Configuration
//{
//    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
//    {
//        public void Configure(EntityTypeBuilder<Employee> builder)
//        {
//            //builder.ToTable(x => x.IsTemporal(t =>
//            //{
//            //    t.HasPeriodStart("PeriodStart");
//            //    t.HasPeriodEnd("PeriodEnd");
//            //}));
//            builder.Property(x => x.EmployeeId)
//                .IsRequired()
//                .HasDefaultValueSql("NEXT VALUE FOR EMPLOYEEID");
//            builder.HasIndex(X => X.EmployeeId).IsUnique(true).IsClustered(false);
//            builder.HasOne(x => x.BusinessUnits).WithMany().HasForeignKey(x => x.BusinessUnitID);
//            builder.HasOne(x => x.Job).WithMany().HasForeignKey(x => x.JobId).OnDelete(DeleteBehavior.NoAction);
//        }
//    }
//}


using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {

           // Removed SQL Server - specific default value
            builder.Property(x => x.EmployeeId)
                .IsRequired(); // No default value, handled manually or via app logic

           // Removed IsClustered(not supported by PostgreSQL)
            builder.HasIndex(x => x.EmployeeId).IsUnique();

            builder.HasOne(x => x.BusinessUnits)
                   .WithMany()
                   .HasForeignKey(x => x.BusinessUnitID);

            builder.HasOne(x => x.Job)
                   .WithMany()
                   .HasForeignKey(x => x.JobId)
                   .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
