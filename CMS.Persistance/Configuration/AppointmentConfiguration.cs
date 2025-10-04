using CMS.Domain.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.AppointmentDate).IsRequired();
            builder.Property(x => x.Subject).IsRequired().HasMaxLength(250);
            builder.Property(x => x.Location).HasMaxLength(500);

            builder.HasOne(x => x.Case)
                   .WithMany(c => c.Appointments)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.BusinessUnit)
                   .WithMany(b => b.Appointments)
                   .HasForeignKey(x => x.BusinessUnitId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.ScheduledBy)
                   .WithMany()
                   .HasForeignKey(x => x.ScheduledById)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
