
using CMS.Domain.letters;
using CMS.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CMS.Persistence.Configurations;

public class LetterConfiguration : IEntityTypeConfiguration<Letter>
{
    public void Configure(EntityTypeBuilder<Letter> builder)
    {
        // Configure Sender relationship
        builder.HasOne(l => l.Sender)
            .WithMany(u => u.SentLetters)
            .HasForeignKey(l => l.SenderId)
            .IsRequired(false) // Sender is optional
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Recipient relationship
        builder.HasOne(l => l.Recipient)
            .WithMany(u => u.ReceivedLetters)
            .HasForeignKey(l => l.RecipientId)
            .IsRequired(false) // Recipient is optional
            .OnDelete(DeleteBehavior.Restrict);

        // Other Letter configurations can go here
        builder.Property(l => l.Subject)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(l => l.ReferenceNumber)
            .HasMaxLength(50)
            .IsRequired();
    }
}

public class UserConfiguration : IEntityTypeConfiguration<HRUser>
{
    public void Configure(EntityTypeBuilder<HRUser> builder)
    {
        builder.ToTable(x => x.IsTemporal(t =>
        {
            t.HasPeriodStart("PeriodStart");
            t.HasPeriodEnd("PeriodEnd");
        }));
        // Configure navigation properties
        builder.HasMany(u => u.SentLetters)
            .WithOne(l => l.Sender)
            .HasForeignKey(l => l.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.ReceivedLetters)
            .WithOne(l => l.Recipient)
            .HasForeignKey(l => l.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        // Other User configurations
    }
}