//using CMS.Domain.Assignment;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//public class JudgeAssignmentConfiguration : IEntityTypeConfiguration<JudgeAssignment>
//{
//    public void Configure(EntityTypeBuilder<JudgeAssignment> builder)
//    {
//        builder.ToTable("JudgeAssignments");
//        builder.HasKey(x => x.Id);
//        builder.Property(x => x.JudgeId).IsRequired();
//        builder.Property(x => x.AssignedAt).IsRequired();

//        // Judge (AspNetUsers)
//        builder.HasOne(x => x.Judge)
//               .WithMany()
//               .HasForeignKey(x => x.JudgeId)
//               .OnDelete(DeleteBehavior.Restrict);

//        // Case
//        builder.HasOne(x => x.Case)
//               .WithMany(c => c.JudgeAssignments)
//               .HasForeignKey(x => x.CaseId)
//               .OnDelete(DeleteBehavior.Restrict); // ⬅ changed from Cascade

//        // Chilot
//        builder.HasOne(x => x.Chilot)
//               .WithMany(ch => ch.JudgeAssignments)
//               .HasForeignKey(x => x.ChilotId)
//               .OnDelete(DeleteBehavior.SetNull);

//        // BusinessUnit
//        builder.HasOne(x => x.BusinessUnit)
//               .WithMany(b => b.JudgeAssignments)
//               .HasForeignKey(x => x.BusinessUnitId)
//               .OnDelete(DeleteBehavior.Cascade); // keep cascade here
//    }
//}
