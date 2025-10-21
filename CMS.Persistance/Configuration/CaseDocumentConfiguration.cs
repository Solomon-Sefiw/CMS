//using CMS.Domain.Cases;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace CMS.Persistance.Configuration
//{
//    public class CaseDocumentConfiguration : IEntityTypeConfiguration<Case>
//    {
//        public void Configure(EntityTypeBuilder<CaseDocument> builder)
//        {
//            builder.ToTable("CaseDocuments");
//            builder.HasKey(x => x.Id);
//            builder.Property(x => x.FileName).IsRequired().HasMaxLength(260);
//            builder.Property(x => x.FilePath).IsRequired().HasMaxLength(500);
//            builder.Property(x => x.PageCount).IsRequired();
//            builder.Property(x => x.UploadedAt).IsRequired();
//            builder.HasOne(x => x.Case)
//                   .WithMany(c => c.Documents)
//                   .HasForeignKey(x => x.CaseId)
//                   .OnDelete(DeleteBehavior.Cascade);
//        }
//    }
//}
