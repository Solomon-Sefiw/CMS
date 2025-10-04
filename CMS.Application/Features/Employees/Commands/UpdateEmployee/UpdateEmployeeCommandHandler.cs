using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Jobs;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.Commands.UpdateEmployee
{
    public class UpdateEmployeeCommand : IRequest<int>
    {

        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }

        public string AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public string? AmharicDisplayName { get; set; }
        public int BusinessUnitID { get; set; }
        public int JobId { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly EmployementDate { get; set; }
        public Gender Gender { get; set; }
        public MartialStatus MartialStatus { get; set; }
        public int? SalaryOnGradeStepId { get; set; }//0 for base,10 for Ceiling and step is from grade steps 
        public string? TinNumber { get; set; }
        public string? PensionID { get; set; }
        public EmploymentType? EmploymentType { get; set; }

    }
    public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public UpdateEmployeeCommandHandler(IDataService dataService ,IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;

        }

        public async Task<int> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
        {

            var employee = dataService.Employees.FirstOrDefault(x => x.Id == request.Id);
            if (employee.JobId == request.JobId)
            {
                employee.FirstName = request.FirstName;
                employee.MiddleName = request.MiddleName;
                employee.LastName = request.LastName;
                employee.DisplayName = request.FirstName + " " + request.MiddleName + " " + request.LastName;
                employee.AmharicFirstName = request.AmharicFirstName;
                employee.AmharicMiddleName = request.AmharicMiddleName;
                employee.AmharicLastName = request.AmharicLastName;
                employee.AmharicDisplayName = request.AmharicFirstName + " " + request.AmharicMiddleName + " " + request.AmharicLastName;
                employee.Gender = request.Gender;
                employee.JobId = employee.JobId;
                employee.MartialStatus = request.MartialStatus;
                employee.BusinessUnitID = request.BusinessUnitID;
                employee.BirthDate = request.BirthDate;
                employee.EmployementDate = request.EmployementDate;
                employee.ApprovalStatus = ApprovalStatus.Draft;
                employee.SalaryOnGradeStepId = request.SalaryOnGradeStepId;
                employee.EmploymentType = request?.EmploymentType;
                employee.PensionID = request?.PensionID;
                employee.TinNumber = request?.TinNumber;

            }
            else
            {
                await dataService.Jobs.Where(a=>a.Id == employee.JobId)
                    .ExecuteUpdateAsync(a=>a.SetProperty(a=>a.IsVacant,true));
                 await dataService.Jobs.Where(a => a.Id == request.JobId)
                    .ExecuteUpdateAsync(a => a.SetProperty(a => a.IsVacant, false));
                employee.FirstName = request.FirstName;
                employee.MiddleName = request.MiddleName;
                employee.LastName = request.LastName;
                employee.DisplayName = request.FirstName + " " + request.MiddleName + " " + request.LastName;
                employee.AmharicFirstName = request.AmharicFirstName;
                employee.AmharicMiddleName = request.AmharicMiddleName;
                employee.AmharicLastName = request.AmharicLastName;
                employee.AmharicDisplayName = request.AmharicFirstName + " " + request.AmharicMiddleName + " " + request.AmharicLastName;
                employee.Gender = request.Gender;
                employee.JobId = request.JobId;
                employee.MartialStatus = request.MartialStatus;
                employee.BusinessUnitID = request.BusinessUnitID;
                employee.BirthDate = request.BirthDate;
                employee.EmployementDate = request.EmployementDate;
                employee.ApprovalStatus = ApprovalStatus.Draft;
                employee.SalaryOnGradeStepId = request.SalaryOnGradeStepId;
                employee.EmploymentType = request?.EmploymentType;
                employee.PensionID = request?.PensionID;
                employee.TinNumber = request?.TinNumber;

            }
            await dataService.SaveAsync(cancellationToken);
            await employeeChangeLogService.LogEmployeeBasicInfoChange(employee, ChangeType.Modified, cancellationToken);

            return employee.Id;
        }
    }
}