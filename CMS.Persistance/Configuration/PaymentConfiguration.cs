using CMS.Domain.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(x => x.Gateway).HasMaxLength(50);
            builder.Property(x => x.TransactionId).HasMaxLength(200);
            builder.Property(x => x.ReceiptFilePath).HasMaxLength(500);

            builder.HasOne(x => x.Case)
                   .WithMany(c => c.Payments)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.ProcessedBy)
                   .WithMany()
                   .HasForeignKey(x => x.ProcessedById)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
