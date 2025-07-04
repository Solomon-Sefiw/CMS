using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Queries
{
    public record GetJobRoleQuery : IRequest<List<JobRoleDto>>;
    internal class GetAllJobRoleQueryHandler : IRequestHandler<GetJobRoleQuery, List<JobRoleDto>>
    {
        private readonly IDataService dataService;
        public GetAllJobRoleQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<JobRoleDto>> Handle(GetJobRoleQuery request, CancellationToken cancellationToken)
        {
            var jobRoles = await dataService.JobRoles.ToListAsync();
            var newjobRoleList = new List<JobRoleDto>();
            var jobCatagoryList = await dataService.JobCatagories.ToListAsync();
            var jobRoleCatagories = await dataService.JobRoleCatagories.ToListAsync();
            var jobGradeList = await dataService.JobGrades.ToListAsync();
            
            foreach (var JR in jobRoles)
            {   
                var jobCatagory = jobCatagoryList.Where(j => j.Id == JR.JobCatagoryId).FirstOrDefault();
                var JobRoleCatagories = jobRoleCatagories.Where(jobRoleCatagories => jobRoleCatagories.Id == JR.JobRoleCategoryId).FirstOrDefault();
                var jobGrade = jobGradeList.Where(j => j.JobGradeId == JR.JobGradeId).FirstOrDefault();
                var jobRole = new JobRoleDto()
                {
                    Id = JR.Id,
                    RoleName = JR.RoleName,
                    JobRoleCatagory = JobRoleCatagories.Name,
                    Description = JR.Description,
                    JobCatagory = jobCatagory.JobCategoryName,
                    JobGrade = jobGrade.JobGradeRomanId,
                    ApprovalStatus= JR.ApprovalStatus,     
                };
                newjobRoleList.Add(jobRole);
            }

            return newjobRoleList;
        }
    }
}
