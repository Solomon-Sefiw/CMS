using CMS.Domain.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistence.Configurations
{
    internal class EmployeeCommentConfiguration : IEntityTypeConfiguration<EmployeeComment>
    {
        public void Configure(EntityTypeBuilder<EmployeeComment> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasOne(x => x.Employee)
                .WithMany(x => x.EmployeeComments)
                .HasForeignKey(x => x.EmployeeId);
        }
    }
}
