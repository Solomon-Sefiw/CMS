using CMS.Domain.Judgments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class JudgmentConfiguration : IEntityTypeConfiguration<Judgment>
    {
        public void Configure(EntityTypeBuilder<Judgment> builder)
        {
            builder.ToTable("Judgments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.HtmlContent).IsRequired();
            builder.Property(x => x.PdfFilePath).HasMaxLength(500);
            builder.Property(x => x.FileHash).HasMaxLength(200);

            builder.HasOne(x => x.Case)
                   .WithMany(c => c.Judgments)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.SignedBy)
                   .WithMany()
                   .HasForeignKey(x => x.SignedByUserId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
