using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace CMS.Persistance.Configuration
{
    public class BusinessUnitConfiguration : IEntityTypeConfiguration<BusinessUnit>
    {
        public void Configure (EntityTypeBuilder<BusinessUnit> builder)
        {
            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));
            builder.HasKey(x => x.Id);
            builder.HasOne(x=>x.BusinessUnitType).WithMany().HasForeignKey(x => x.Type);

            //builder.Property(b => b.BusinessUnitID).IsRequired().HasMaxLength(50);
            //builder.HasIndex(b => b.BusinessUnitID).IsUnique();
            //builder.Property(b => b.Name).IsRequired().HasMaxLength(200);
            //builder.Property(b => b.BusinessUnitCode).HasMaxLength(50);
            //builder.Property(b => b.Location).HasMaxLength(200);
            //builder.Property(b => b.Address).HasMaxLength(200);
            //builder.Property(b => b.CourtCode).HasMaxLength(200);

            builder.HasMany(b => b.Chillots)
                   .WithOne(ch => ch.BusinessUnit)
                   .HasForeignKey(ch => ch.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.Cases)
                   .WithOne(c => c.BusinessUnit)
                   .HasForeignKey(c => c.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(b => b.Appointments)
                   .WithOne(a => a.BusinessUnit)
                   .HasForeignKey(a => a.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.JudgeAssignments)
                   .WithOne(j => j.BusinessUnit)
                   .HasForeignKey(j => j.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Cascade);
        
        }
    }
}
