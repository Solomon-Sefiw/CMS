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
    public record GetJobCategoryByIdQuery : IRequest<JobCategoryDto>
    {
        public int Id { get; set; }
        public GetJobCategoryByIdQuery(int id)
        {
            this.Id = id;
        }
    }
    public class GetJobCategoryByIdQueryHandler : IRequestHandler<GetJobCategoryByIdQuery, JobCategoryDto>
    {
        private readonly IDataService dataService;

        public GetJobCategoryByIdQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<JobCategoryDto> Handle(GetJobCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
                                .FirstOrDefaultAsync(j => j.Id == request.Id, cancellationToken);

            if (jobCategory == null)
                return null;

            return new JobCategoryDto
            {
                Id = jobCategory.Id,
                JobCategoryName = jobCategory.JobCategoryName,
                ProbationPeriodInDays = jobCategory.ProbationPeriodInDays,
                IsActive = jobCategory.IsActive,
                ApprovalStatus = jobCategory.ApprovalStatus,
                CreatedAt=jobCategory.CreatedAt,
            };
        }
    }
}
