using CMS.Domain.Hearings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class HearingConfiguration : IEntityTypeConfiguration<Hearing>
    {
        public void Configure(EntityTypeBuilder<Hearing> builder)
        {
            builder.ToTable("Hearings");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ScheduledAt).IsRequired();
            builder.Property(x => x.LocationOrUrl).HasMaxLength(500);
            builder.HasOne(x => x.Case)
                   .WithMany(c => c.Hearings)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Chilot)
                   .WithMany()
                   .HasForeignKey(x => x.ChilotId)
                   .OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.BusinessUnit)
                   .WithMany()
                   .HasForeignKey(x => x.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
