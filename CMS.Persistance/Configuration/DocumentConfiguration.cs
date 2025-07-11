//using CMS.Domain.Document;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace CMS.Persistance.Configuration
//{
//    public class DocumentConfiguration : IEntityTypeConfiguration<Document>
//    {
//        public void Configure(EntityTypeBuilder<Document> builder)
//        {
//            builder.HasKey(x => x.Id);
//            builder.Property(x => x.Id).HasDefaultValueSql("NEWID()");
//        }
//    }
//}
using CMS.Domain.Document;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistance.Configuration
{
    public class DocumentConfiguration : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.HasKey(x => x.Id);

            // ✅ Use gen_random_uuid() and cast to text for PostgreSQL
            builder.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()::text");
        }
    }
}
