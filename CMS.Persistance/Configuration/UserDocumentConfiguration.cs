//using CMS.Domain.User;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace CMS.Persistance.Configuration
//{
//    public class UserDocumentConfiguration : IEntityTypeConfiguration<UserDocument>
//    {
//        public void Configure(EntityTypeBuilder<UserDocument> builder)
//        {
//            builder.ToTable("UserDocuments");
//            builder.HasKey(x => x.Id);
//            builder.Property(x => x.UserId).IsRequired().HasMaxLength(100);
//            builder.Property(x => x.FileName).IsRequired().HasMaxLength(260);
//            builder.Property(x => x.FilePath).IsRequired().HasMaxLength(500);
//        }
//    }
//}
