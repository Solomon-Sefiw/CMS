using CMS.Domain.Benefit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class JobRoleBenefitConfiguration : IEntityTypeConfiguration<JobRoleBenefit>
    {
        public void Configure(EntityTypeBuilder<JobRoleBenefit> builder)
        {
            builder.ToTable("JobRoleBenefits");

            builder.HasKey(jrb => jrb.Id);

            builder.HasOne(jrb => jrb.JobRole)
                .WithMany(jr => jr.JobRoleBenefits)
                .HasForeignKey(jrb => jrb.JobRoleId);

            builder.HasOne(jrb => jrb.Benefit)
                .WithMany(b => b.JobRoleBenefits)
                .HasForeignKey(jrb => jrb.BenefitId);

            builder.HasOne(jrb => jrb.BenefitValue)
                .WithMany()
                .HasForeignKey(jrb => jrb.BenefitValueId)
                .OnDelete(DeleteBehavior.Restrict);

            //  Global query filter to exclude soft-deleted records
            builder.HasQueryFilter(b => !b.IsDeleted);

        }
    }
}
