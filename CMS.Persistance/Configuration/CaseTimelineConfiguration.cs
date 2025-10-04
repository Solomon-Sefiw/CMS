using CMS.Domain.Timelines;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class CaseTimelineConfiguration : IEntityTypeConfiguration<CaseTimeline>
    {
        public void Configure(EntityTypeBuilder<CaseTimeline> builder)
        {
            builder.ToTable("CaseTimelines");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.EventType).IsRequired().HasMaxLength(150);
            builder.Property(x => x.Details).HasMaxLength(500);
            builder.HasOne(x => x.Case)
                   .WithMany(c => c.Timeline)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
