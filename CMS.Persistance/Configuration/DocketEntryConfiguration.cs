using CMS.Domain.Archive;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class DocketEntryConfiguration : IEntityTypeConfiguration<DocketEntry>
    {
        public void Configure(EntityTypeBuilder<DocketEntry> builder)
        {
            builder.ToTable("DocketEntries");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.DocketNumber).IsRequired().HasMaxLength(100);
            builder.Property(x => x.StoragePath).HasMaxLength(500);
        }
    }
}
