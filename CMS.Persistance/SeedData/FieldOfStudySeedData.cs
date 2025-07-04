using CMS.Domain.Education;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public static class FieldOfStudySeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.FieldOfStudies.Any()) return;

            var fieldsOfStudy = new List<FieldOfStudy>()
            {
              new FieldOfStudy() { Name = "Computer Science", Description = "The study of computation and information.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Software Engineering", Description = "The application of engineering principles to the design, development, and maintenance of software.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Information Technology", Description = "The application of computers and telecommunications equipment to store, retrieve, transmit, and manipulate data.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Business Administration", Description = "The study of managing business operations.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Marketing", Description = "The study of how to promote and sell products or services.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Finance", Description = "The study of the management of money and investments.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Accounting", Description = "The systematic and comprehensive recording of financial transactions.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Electrical Engineering", Description = "The design, development, testing, and supervision of the manufacturing of electrical equipment.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Mechanical Engineering", Description = "The design, development, construction, and testing of mechanical and thermal devices, including tools, engines, and machines.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Civil Engineering", Description = "The design, construction, and maintenance of the physical and naturally built environment.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Medicine", Description = "The science and practice of the diagnosis, treatment, and prevention of disease.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Nursing", Description = "The provision of care for individuals, families, and communities.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Pharmacy", Description = "The science and technique of preparing and dispensing drugs.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Law", Description = "The system of rules which a particular country or community recognizes as regulating the actions of its members and which it may enforce by the imposition of penalties.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Economics", Description = "The social science that studies how societies manage their scarce resources.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Psychology", Description = "The scientific study of the human mind and its functions, especially those affecting behavior in a given context.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Sociology", Description = "The study of the development, structure, and functioning of human society.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "History", Description = "The study of past events, particularly in human affairs.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Literature", Description = "Written works, especially those considered of superior or lasting artistic merit.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Mathematics", Description = "The abstract science of number, quantity, and space.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Physics", Description = "The natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Chemistry", Description = "The branch of science that deals with the identification of the substances of which matter is composed; the investigation of their properties and the ways in which they interact, combine, and change; and the use of these processes to form new substances.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Biology", Description = "The scientific study of life and living organisms.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Art", Description = "The expression or application of human creative skill and imagination.", ApprovalStatus = ApprovalStatus.Draft },
new FieldOfStudy() { Name = "Music", Description = "Vocal or instrumental sounds (or both) combined in such a way as to produce beauty of form, harmony, and expression of emotion.", ApprovalStatus = ApprovalStatus.Draft }
                // Add more fields of study as needed
            };

            await context.FieldOfStudies.AddRangeAsync(fieldsOfStudy);
        }
    }
}