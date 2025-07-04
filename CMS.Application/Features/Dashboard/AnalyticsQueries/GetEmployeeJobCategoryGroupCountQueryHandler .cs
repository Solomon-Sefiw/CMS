using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.AnalyticsQueries
{
    public class GetJobCategoryGroupCountQueryHandler : IRequestHandler<GetEmployeeJobCategoryGroupCountQuery, List<JobCategoryGroup>>
    {
        private readonly IDataService _dataService;

        public GetJobCategoryGroupCountQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<JobCategoryGroup>> Handle(GetEmployeeJobCategoryGroupCountQuery request, CancellationToken cancellationToken)
        {
            var employeeGroupedByJobCat = await (
                  from emp in _dataService.Employees
                  join job in _dataService.Jobs on emp.JobId equals job.Id
                  join role in _dataService.JobRoles on job.JobRoleId equals role.Id
                  join cat in _dataService.JobCatagories on role.JobCatagoryId equals cat.Id
                  where emp.EmployeeStatus == EmployeeStatusEnum.Active && cat.IsActive
                  group emp by cat.JobCategoryName into g
                  select new JobCategoryGroup(g.Key, g.Count())
              ).ToListAsync(cancellationToken);

            return employeeGroupedByJobCat;
        }
    }
}
