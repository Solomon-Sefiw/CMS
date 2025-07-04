using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Persistance.DBContext;
using CMS.Domain.Jobs;

namespace CMS.Persistance.SeedData
{
    public class JobGradeStepsValueSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            DateOnly StartDate = new DateOnly(2025, 4, 30); // Year, Month, Day
            DateOnly EndDate = new DateOnly(2025, 4, 30); // Year, Month, Day

            if (context.JobGradeStepsValues.Any()) return;
            var jobGradeStepsValue = new List<JobGradeStepsValue>()
            {
                 new JobGradeStepsValue() {StepEnd=9 ,StartDate=StartDate,EndDate=EndDate,Description="Current Step Value" },
            };
            await context.JobGradeStepsValues.AddRangeAsync(jobGradeStepsValue);
        }
    }
}
