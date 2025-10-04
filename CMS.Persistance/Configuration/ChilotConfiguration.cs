using CMS.Domain.Courts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class ChilotConfiguration : IEntityTypeConfiguration<Chilot>
    {
        public void Configure(EntityTypeBuilder<Chilot> builder)
        {
            builder.ToTable("Chilots");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(150);
            builder.Property(x => x.RoomNumber).HasMaxLength(50);
            builder.HasOne(x => x.BusinessUnit)
                   .WithMany(b => b.Chillots)
                   .HasForeignKey(x => x.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Cases)
                   .WithOne(c => c.Chilot)
                   .HasForeignKey(c => c.ChilotId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
