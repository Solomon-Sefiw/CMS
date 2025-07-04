using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Persistance.DBContext;

namespace CMS.Persistance.SeedData
{
    public static class JobCatagorySeedData
    {
        public static async Task SeedAsync (CMSDBContext context)
        {
            if (context.JobCatagories.Any()) return;
            var jobCatagories = new List<JobCatagory>()
            {
                new JobCatagory() {JobCategoryName="Clerical",ProbationPeriodInDays=60,ApprovalStatus=ApprovalStatus.Draft },
                new JobCatagory() {JobCategoryName="NonClerical",ProbationPeriodInDays=60, ApprovalStatus=ApprovalStatus.Draft },
                new JobCatagory() {JobCategoryName="Professional",ProbationPeriodInDays=60 , ApprovalStatus = ApprovalStatus.Draft},
                new JobCatagory() {JobCategoryName="Managerial",ProbationPeriodInDays=90 , ApprovalStatus = ApprovalStatus.Draft}
            };
            await context.JobCatagories.AddRangeAsync(jobCatagories);
        }
    }
}
