using CMS.Domain.Chat;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class ChatbotMessageConfiguration : IEntityTypeConfiguration<ChatbotMessage>
    {
        public void Configure(EntityTypeBuilder<ChatbotMessage> builder)
        {
            builder.ToTable("ChatbotMessages");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Message).IsRequired();
            builder.Property(x => x.Response).HasMaxLength(2000);
            builder.Property(x => x.SentAt).IsRequired();

            builder.HasOne(x => x.Case)
                   .WithMany(c => c.ChatbotMessages)
                   .HasForeignKey(x => x.CaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Sender)
                   .WithMany()
                   .HasForeignKey(x => x.SenderId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Receiver)
                   .WithMany()
                   .HasForeignKey(x => x.ReceiverId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
