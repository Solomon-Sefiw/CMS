﻿using CMS.Domain.Chat;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.Configuration
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Content).IsRequired();
            builder.Property(x => x.SentAt).IsRequired();

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
