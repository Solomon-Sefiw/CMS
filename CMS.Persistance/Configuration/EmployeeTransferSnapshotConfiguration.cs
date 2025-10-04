using CMS.Domain.Transfer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class EmployeeTransferSnapshotConfiguration : IEntityTypeConfiguration<EmployeeTransferSnapshot>
    {
        public void Configure(EntityTypeBuilder<EmployeeTransferSnapshot> builder)
        {
            builder.ToTable("EmployeeTransferSnapshots");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.EffectiveTransferDate)
                .IsRequired()
                .HasColumnType("date"); // since you're using DateOnly

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

            builder.HasOne(x => x.PreviousBusinessUnit)
                .WithMany()
                .HasForeignKey(x => x.PreviousBusinessUnitId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.PreviousJobRole)
                .WithMany()
                .HasForeignKey(x => x.PreviousJobRoleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
