using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class ReemploymentConfiguration : IEntityTypeConfiguration<Reemployment>
    {
        public void Configure(EntityTypeBuilder<Reemployment> builder)
        {
            builder.ToTable("Reemployments");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ReemploymentType)
                .IsRequired();

            builder.Property(x => x.ApprovalStatus)
                .IsRequired();

            builder.Property(x => x.ReemploymnetDate)
                .IsRequired()
                .HasColumnType("date");

            builder.Property(x => x.ReasonForReemploymnet)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Remark)
                .HasMaxLength(1000);

            builder.HasOne(x => x.Employee)
                .WithMany()
                .HasForeignKey(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
