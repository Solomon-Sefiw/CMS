using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public class JobGradeSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.JobCatagories.Any()) return;
            var jobGrades = new List<JobGrade>()
            {
              //  new JobGrade() {JobGradeId=(int)JobGradeEnum.JobGradeOne ,Name="JobGrade1",Description="Clerical" },
              ///  new JobGrade() {JobGradeId=(int)JobGradeEnum.JobGradeTwo ,Name="JobGrade2",Description="Non_Clerical" },
               // new JobGrade() {JobGradeId=(int)JobGradeEnum.JobGradeThree ,Name="JobGrade3",Description="Professional" },
               // new JobGrade() {JobGradeId=(int)JobGradeEnum.JobGradeFour ,Name="JobGrade4",Description="Managerial" }
            };
            await context.JobGrades.AddRangeAsync(jobGrades);
        }
    }
}
