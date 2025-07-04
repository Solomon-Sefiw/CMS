using CMS.Application.Features.Jobs.JobCatagories.Model;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobCatagories.Query
{


    public class GetAllJobCategoriesQueryHandler : IRequestHandler<GetAllJobCategoriesQuery, JobCategoryLists>
    {
        private readonly IDataService dataService;

        public GetAllJobCategoriesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<JobCategoryLists> Handle(GetAllJobCategoriesQuery query, CancellationToken cancellationToken)
        {
            var jobCategories = await dataService.JobCatagories

                .Select(j => new JobCategoryDto
                {
                    Id = j.Id,
                    JobCategoryName = j.JobCategoryName,
                    ProbationPeriodInDays = j.ProbationPeriodInDays,
                    IsActive = j.IsActive,
                    ApprovalStatus = j.ApprovalStatus,
                    CreatedAt = j.CreatedAt,
                })
                .ToListAsync(cancellationToken);
            var approved = jobCategories.Where(r => r.ApprovalStatus == ApprovalStatus.Approved && r.IsActive==true).ToList();
            var submitted = jobCategories.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = jobCategories.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = jobCategories.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new JobCategoryLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );


        }
    }
}

