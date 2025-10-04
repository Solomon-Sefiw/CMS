using CMS.Domain.Cases;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class CaseConfiguration : IEntityTypeConfiguration<Case>
    {
        public void Configure(EntityTypeBuilder<Case> builder)
        {
            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));
            builder.ToTable("Cases");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.CaseNumber).IsRequired().HasMaxLength(120);
            builder.HasIndex(x => x.CaseNumber).IsUnique();

            builder.Property(x => x.PlaintiffName).IsRequired().HasMaxLength(250);
            builder.Property(x => x.AccusedName).IsRequired().HasMaxLength(250);
            builder.Property(x => x.Subject).HasMaxLength(500);

            builder.HasOne(x => x.FiledBy)
                   .WithMany(u => u.FiledCases)
                   .HasForeignKey(x => x.FiledById)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.AssignedJudge)
                   .WithMany(u => u.AssignedCases)
                   .HasForeignKey(x => x.AssignedJudgeId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.BusinessUnit)
                   .WithMany(b => b.Cases)
                   .HasForeignKey(x => x.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Chilot)
                   .WithMany(ch => ch.Cases)
                   .HasForeignKey(x => x.ChilotId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(x => x.Documents)
                   .WithOne(d => d.Case)
                   .HasForeignKey(d => d.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Hearings)
                   .WithOne(h => h.Case)
                   .HasForeignKey(h => h.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
