using CMS.Domain.Transfer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeeTransferConfiguration : IEntityTypeConfiguration<EmployeeTransfer>
    {
        public void Configure(EntityTypeBuilder<EmployeeTransfer> builder)
        {
            builder.ToTable("EmployeeTransfers");

            builder.HasKey(x => x.Id); 

            builder.Property(x => x.EffectiveTransferDate)
                .IsRequired()
                .HasColumnType("date"); 

            builder.Property(x => x.TransferType)
                .IsRequired();

            builder.Property(x => x.TransferReason)
                .HasMaxLength(500);

            builder.Property(x => x.Remark)
                .HasMaxLength(1000);

            builder.HasOne(x => x.Employee)
                .WithMany()
                .HasForeignKey(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.FromBusinessUnit)
                .WithMany()
                .HasForeignKey(x => x.FromBusinessUnitId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ToBusinessUnit)
                .WithMany()
                .HasForeignKey(x => x.ToBusinessUnitId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.FromJobRole)
                .WithMany()
                .HasForeignKey(x => x.FromJobRoleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ToJobRole)
                .WithMany()
                .HasForeignKey(x => x.ToJobRoleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
