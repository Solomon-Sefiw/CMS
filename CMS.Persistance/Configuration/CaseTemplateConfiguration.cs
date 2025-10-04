using CMS.Domain.Templates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class CaseTemplateConfiguration : IEntityTypeConfiguration<CaseTemplate>
    {
        public void Configure(EntityTypeBuilder<CaseTemplate> builder)
        {
            builder.ToTable("CaseTemplates");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(150);
            builder.Property(x => x.Content).IsRequired();
            builder.HasOne(x => x.CreatedBy)
                   .WithMany()
                   .HasForeignKey(x => x.CreatedById)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
