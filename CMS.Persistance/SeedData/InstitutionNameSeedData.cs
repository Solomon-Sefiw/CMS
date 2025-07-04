using CMS.Domain.Education;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public static class InstitutionNameSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.InstitutionNames.Any()) return;

            var institutionNames = new List<InstitutionName>()
            {
              new InstitutionName() { Name = "Addis Ababa University", Description = "Public university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Bahir Dar University", Description = "Public university in Bahir Dar, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Mekelle University", Description = "Public university in Mekelle, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Jimma University", Description = "Public university in Jimma, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Mizan-Tepi University", Description = "Public university in Mizan And Tepi, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Hawassa University", Description = "Public university in Hawassa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Wollo University", Description = "Public university in Dessie, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Debre Markos University", Description = "Public university in Debre Markos, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Gondar University", Description = "Public university in Gondar, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Adama Science and Technology University", Description = "Public university in Adama, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Arba Minch University", Description = "Public university in Arba Minch, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Debre Birhan University", Description = "Public university in Debre Birhan, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Dilla University", Description = "Public university in Dilla, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Dire Dawa University", Description = "Public university in Dire Dawa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Jigjiga University", Description = "Public university in Jigjiga, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Kombolcha Institute of Technology", Description = "Public institute of technology in Kombolcha, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Wachemo University", Description = "Public university in Hossana, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Ambo University", Description = "Public university in Ambo, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Assosa University", Description = "Public university in Assosa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Samara University", Description = "Public university in Semera, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Wolaita Sodo University", Description = "Public university in Sodo, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Mettu University", Description = "Public university in Mettu, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Robe Institute of Technology", Description = "Public institute of technology in Robe, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Bonga University", Description = "Public university in Bonga, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Haramaya University", Description = "Public university in Haramaya, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Arsi University", Description = "Public university in Asella, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Debre Tabor University", Description = "Public university in Debre Tabor, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Injibara University", Description = "Public university in Injibara, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Werabe University", Description = "Public university in Werabe, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Woldia University", Description = "Public university in Woldia, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Aksum University", Description = "Public university in Aksum, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Adigrat University", Description = "Public university in Adigrat, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Madda Walabu University", Description = "Public university in Bale Robe, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Oda Bultum University", Description = "Public university in Chiro, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Dambi Dollo University", Description = "Public university in Dembidolo, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Gambella University", Description = "Public university in Gambella, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Benishangul-Gumuz Regional State University", Description = "Public university in Assosa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Southern Nations, Nationalities, and Peoples' Regional State University", Description = "Umbrella for various colleges in the SNNPR region, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
// Add more public and private universities and colleges in Ethiopia
new InstitutionName() { Name = "Unity University", Description = "Private university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "St. Mary's University", Description = "Private university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Addis Ababa Science and Technology University", Description = "Public university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Kotebe Metropolitan University", Description = "Public university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Ethiopian Civil Service University", Description = "Public university in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Admas University", Description = "Private university with multiple campuses in Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Alpha University College", Description = "Private university college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Entoto Polytechnic College", Description = "Public technical and vocational college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "National College", Description = "Private college with multiple campuses in Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Leadstar University College", Description = "Private university college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Royal College", Description = "Private college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Boston Day College", Description = "Private college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Omega College", Description = "Private college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Excellent Leadership Academy College", Description = "Private college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Gelan Comprehensive College", Description = "Private college in Gelan, Oromia, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "HiLCoE School of Computer Science and Technology", Description = "Private college in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "ICT Institute", Description = "Private IT training institute in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "NIIT Ethiopia", Description = "Private IT training institute with multiple locations in Ethiopia", ApprovalStatus = ApprovalStatus.Draft },
new InstitutionName() { Name = "Aptech Computer Education", Description = "Private IT training institute in Addis Ababa, Ethiopia", ApprovalStatus = ApprovalStatus.Draft }
// ... Add many more Ethiopian universities and colleges (public and private)
            };

            await context.InstitutionNames.AddRangeAsync(institutionNames);
        }
    }
}