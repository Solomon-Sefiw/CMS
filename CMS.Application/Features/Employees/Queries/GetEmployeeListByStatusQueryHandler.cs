using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Queries
{
    public record EmployeeList(
    List<EmployeeDto> Approved,
    List<EmployeeDto> Submitted,
    List<EmployeeDto> Rejected,
    List<EmployeeDto> Draft
    );
    public record GetEmployeeListByStatusQuery: IRequest<EmployeeList>;
   public class GetEmployeeListByStatusQueryHandler : IRequestHandler<GetEmployeeListByStatusQuery, EmployeeList>
    {
        private readonly IDataService dataService;
        public GetEmployeeListByStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task< EmployeeList> Handle (GetEmployeeListByStatusQuery query ,CancellationToken cancellationToken)
        {
            var employeeList = await dataService.Employees.ToListAsync();
            var newemployeeList = new List<EmployeeDto>();
            var businessUnitList = await dataService.BusinessUnits.ToListAsync();
            var jobTitleList = await dataService.JobRoles.ToListAsync();
            var jobList=await dataService.Jobs.ToListAsync();
            foreach (var emp in employeeList)
            {

                var businessUnit = businessUnitList.Where(bu => bu.Id == emp.BusinessUnitID).FirstOrDefault();
                var job=jobList.Where(jb=>jb.Id==emp.JobId).FirstOrDefault();
                var jobTitle = jobTitleList.Where(j => j.Id== job.JobRoleId).FirstOrDefault();
                var employee = new EmployeeDto()
                {
                    FirstName = emp.FirstName,
                    MiddleName = emp.MiddleName,
                    LastName = emp.LastName,
                    DisplayName = emp.DisplayName,
                    AmharicFirstName = emp.AmharicFirstName,
                    AmharicMiddleName = emp.AmharicMiddleName,
                    AmharicLastName = emp.AmharicLastName,
                    AmharicDisplayName = emp.AmharicDisplayName,
                    BusinessUnit = businessUnit.Name,
                    JobTitle = jobTitle.RoleName,
                    JobId = emp.JobId,
                    BirthDate=emp.BirthDate,
                    EmployementDate=emp.EmployementDate,
                    MartialStatus=emp.MartialStatus,
                    Gender=emp.Gender,
                    ApprovalStatus = emp.ApprovalStatus,
                    SalaryOnGradeStepId = emp.SalaryOnGradeStepId,
                    EmploymentType=emp.EmploymentType,
                    TinNumber=emp.TinNumber,
                    PensionID=emp.PensionID,



                };
                newemployeeList.Add(employee);
            }

            var approved = newemployeeList.Where(bu => bu.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = newemployeeList.Where(bu => bu.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = newemployeeList.Where(bu => bu.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = newemployeeList.Where(bu => bu.ApprovalStatus == ApprovalStatus.Draft).ToList();

            return new EmployeeList(
                Approved: approved,
                Rejected: rejected,
                Submitted: submitted,
                Draft: draft
                );
        }
    }
}
