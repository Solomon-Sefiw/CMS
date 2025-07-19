using CMS.Domain.Benefit;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class BenefitConfiguration : IEntityTypeConfiguration<Benefit>
    {
        public void Configure(EntityTypeBuilder<Benefit> builder)
        {
            builder.ToTable("Benefits", b => b
                .IsTemporal(t =>
                {
                    t.HasPeriodStart("PeriodStart");
                    t.HasPeriodEnd("PeriodEnd");
                }));

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

          

        }
    }
}
