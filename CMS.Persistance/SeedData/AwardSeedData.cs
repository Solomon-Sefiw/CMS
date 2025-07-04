using CMS.Domain.Education;
using CMS.Domain.Education.awards;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public static class AwardSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.Awards.Any()) return;

            var awards = new List<Award>()
            {
                // Basic Education Awards
new Award() { Name = "High School Diploma", Description = "Awarded upon completion of secondary education." , ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "School Leaving Certificate", Description = "General term for a certificate upon leaving school.", ApprovalStatus = ApprovalStatus.Draft },

// Vocational and Technical Certificates
new Award() { Name = "Vocational Certificate", Description = "Awarded upon completion of a vocational training program.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Technical Certificate", Description = "Awarded upon completion of a technical training program.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Professional Certification", Description = "Certification granted by a professional body.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Trade Certificate", Description = "Certification in a specific trade or skill.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Apprenticeship Certificate", Description = "Awarded upon completion of an apprenticeship.", ApprovalStatus = ApprovalStatus.Draft },

// Higher Education Awards
new Award() { Name = "Associate's Degree", Description = "Undergraduate academic degree awarded after completion of a course of study lasting two years.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Bachelor's Degree", Description = "Undergraduate academic degree awarded after completion of a course of study lasting three to four years.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Master's Degree", Description = "Postgraduate academic degree awarded after completion of a course of study lasting one to two years after a bachelor's degree.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Doctorate (PhD)", Description = "The highest level of academic degree awarded in many fields of study.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Postgraduate Diploma", Description = "A postgraduate qualification awarded after a bachelor's degree but typically shorter than a master's degree.", ApprovalStatus = ApprovalStatus.Draft },

// Short Course and Training Certificates
new Award() { Name = "Certificate of Completion", Description = "Awarded for completing a specific short course or training.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Professional Development Certificate", Description = "Awarded for completing professional development training.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Skill-Based Certificate", Description = "Certification in a specific skill or competency.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Online Course Certificate", Description = "Awarded for completing an online course.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Workshop Certificate", Description = "Awarded for participating in a workshop.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Seminar Certificate", Description = "Awarded for attending a seminar.", ApprovalStatus = ApprovalStatus.Draft },

// Academic Honors
new Award() { Name = "Diploma", Description = "A certificate or deed conferring an honor, privilege, or license.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Distinction", Description = "An award or mark of high achievement.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Merit", Description = "An award or mark of good achievement.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Cum Laude", Description = "An academic honor signifying that the graduate has achieved distinction.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Magna Cum Laude", Description = "An academic honor signifying that the graduate has achieved great distinction.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Summa Cum Laude", Description = "An academic honor signifying that the graduate has achieved the highest distinction.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Dean's List", Description = "Recognition for students achieving high grades in a semester or academic year.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Valedictorian", Description = "The student who delivers the farewell speech at a graduation ceremony, typically the one with the highest academic standing.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Salutatorian", Description = "The student who delivers the opening greeting at a graduation ceremony, typically the one with the second-highest academic standing.", ApprovalStatus = ApprovalStatus.Draft },

// Specific Professional Certificates (Examples - Add more relevant to your context)
new Award() { Name = "Project Management Professional (PMP)", Description = "Certification for project managers.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Certified Public Accountant (CPA)", Description = "Certification for accountants.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Microsoft Certified Professional (MCP)", Description = "Certification for Microsoft technologies.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "Cisco Certified Network Associate (CCNA)", Description = "Certification for networking professionals.", ApprovalStatus = ApprovalStatus.Draft },
new Award() { Name = "AWS Certified Solutions Architect", Description = "Certification for AWS cloud architects.", ApprovalStatus = ApprovalStatus.Draft }
// ... Add more specific professional and technical certifications
            };

            await context.Awards.AddRangeAsync(awards);
        }
    }
}