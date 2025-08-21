using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Queries
{
    public record GetEmployeeListQuery : IRequest<List<EmployeeDto>>;
    public class GetEmployeeListQueryHandler : IRequestHandler<GetEmployeeListQuery, List<EmployeeDto>>
    {
        private readonly IDataService dataService;
        public GetEmployeeListQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<EmployeeDto>> Handle(GetEmployeeListQuery query, CancellationToken cancellationToken)
        {
            var employeeList = await dataService.Employees.ToListAsync();
            var newemployeeList = new List<EmployeeDto>();
            var businessUnitList = await dataService.BusinessUnits.ToListAsync();
            var jobTitleList = await dataService.JobRoles.ToListAsync();
            var jobList = await dataService.Jobs.ToListAsync();
            foreach (var emp in employeeList)
            {

                var businessUnit = businessUnitList.Where(bu => bu.Id == emp.BusinessUnitID).FirstOrDefault();
                var job = jobList.Where(jb => jb.Id == emp.JobId).FirstOrDefault();
                var jobTitle = jobTitleList.Where(j => j.Id == job.JobRoleId).FirstOrDefault();
                var employee = new EmployeeDto()
                {
                    Id = emp.Id,
                    FirstName = emp.FirstName,
                    MiddleName = emp.MiddleName,
                    LastName = emp.LastName,
                    DisplayName = emp.DisplayName,
                    AmharicFirstName = emp.AmharicFirstName,
                    AmharicMiddleName = emp.AmharicMiddleName,
                    AmharicLastName = emp.AmharicLastName,
                    AmharicDisplayName = emp.AmharicDisplayName,
                    BusinessUnit = businessUnit.Name,
                    BusinessUnitID = businessUnit.Id,
                    JobTitle = jobTitle.RoleName,
                    JobId = emp.JobId,
                    BirthDate = emp.BirthDate,
                    EmployementDate = emp.EmployementDate,
                    MartialStatus = emp.MartialStatus,
                    Gender = emp.Gender,
                    VersionNumber = emp.VersionNumber,
                    ApprovalStatus = emp.ApprovalStatus,
                    IsNew = emp.IsNew,
                    EmployeeDocuments = emp.EmployeeDocuments,
                    EmployeeStatus = emp.EmployeeStatus,
                    Job = emp.Job,
                    WorkflowComment = emp.WorkflowComment,
                    SalaryOnGradeStepId = emp.SalaryOnGradeStepId,
                    EmploymentType = emp.EmploymentType,
                    PensionID = emp.PensionID,  
                    TinNumber = emp.TinNumber,

                };

                newemployeeList.Add(employee);
            }
            return newemployeeList;
        }
    }
}