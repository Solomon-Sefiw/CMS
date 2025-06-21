using CMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SMS.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder
        .HasOne(e => e.Role).WithMany()
        .HasForeignKey(e => e.RoleId)
        .IsRequired()
        .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(e => e.User)
        .WithMany(x => x.Roles)
        .HasForeignKey(e => e.UserId)
        .IsRequired()
        .OnDelete(DeleteBehavior.NoAction);
    }

}
