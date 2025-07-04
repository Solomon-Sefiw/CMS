using CMS.Application.Features.Jobs.JobCatagories.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Query
{
    public class GetJobCategoryListQuery:IRequest<List <JobCategoryDto>>
    {
        public Guid Id { get; set; }

    }

    public class GetJobCategoryListQueryHandler : IRequestHandler<GetJobCategoryListQuery, List<JobCategoryDto>>
    {
        private readonly IDataService dataService;

        public GetJobCategoryListQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<List<JobCategoryDto>> Handle(GetJobCategoryListQuery request, CancellationToken cancellationToken)
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

            return jobCategories;
        }
    }
}

