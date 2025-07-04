using CMS.Domain.Education;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public static class EducationLevelSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.EducationLevels.Any()) return;

            var educationLevels = new List<EducationLevel>()
            {
              // Higher Education (Descending Order)
new EducationLevel() { Name = "Post-Doctoral", Description = "Research or study pursued after a doctoral degree.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Professional Degree (e.g., MD, JD, MBA)", Description = "Degree focused on a specific profession.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Doctoral Degree (PhD)", Description = "Highest academic degree awarded in many fields.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Master's Degree", Description = "Graduate degree typically requiring one to two years of study after a Bachelor's.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Postgraduate Diploma", Description = "Postgraduate diploma program, shorter than a Master's.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Postgraduate Certificate", Description = "Postgraduate certificate program.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Bachelor's Degree", Description = "Undergraduate degree typically requiring three to four years of study.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Associate Degree", Description = "Undergraduate degree typically requiring two years of study.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Advanced Diploma", Description = "More advanced post-secondary diploma program.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Diploma", Description = "Post-secondary diploma program.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Certificate", Description = "Post-secondary certificate program.", ApprovalStatus = ApprovalStatus.Draft },

// Technical and Vocational Education and Training (TVET) (Descending Order)
new EducationLevel() { Name = "TVET Level V", Description = "Level V of Technical and Vocational Education and Training.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "TVET Level IV", Description = "Level IV of Technical and Vocational Education and Training.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "TVET Level III", Description = "Level III of Technical and Vocational Education and Training.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "TVET Level II", Description = "Level II of Technical and Vocational Education and Training.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "TVET Level I", Description = "Level I of Technical and Vocational Education and Training.", ApprovalStatus = ApprovalStatus.Draft },

// Secondary Education (Descending Order)
new EducationLevel() { Name = "Grade 12", Description = "Twelfth grade / Fourth year of secondary education (Upper Secondary / Preparatory) / Completion of Secondary Education.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 11", Description = "Eleventh grade / Third year of secondary education (Upper Secondary / Preparatory).", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 10", Description = "Tenth grade / Second year of secondary education (Lower Secondary).", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 9", Description = "Ninth grade / First year of secondary education (Lower Secondary).", ApprovalStatus = ApprovalStatus.Draft },

// Primary Education (Descending Order, starting above Grade 4)
new EducationLevel() { Name = "Grade 8", Description = "Eighth grade of primary education / Completion of Primary Education.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 7", Description = "Seventh grade of primary education.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 6", Description = "Sixth grade of primary education.", ApprovalStatus = ApprovalStatus.Draft },
new EducationLevel() { Name = "Grade 5", Description = "Fifth grade of primary education.", ApprovalStatus = ApprovalStatus.Draft }
            };

            await context.EducationLevels.AddRangeAsync(educationLevels);
        }
    }
}