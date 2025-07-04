using AutoMapper;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.Family.Commands;
using CMS.Application.Features.Service;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Language;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Family.Commands
{
    public class AddEmployeeFamilyCommandHandler : IRequestHandler<AddEmployeeFamilyCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public AddEmployeeFamilyCommandHandler(IMapper mapper, IDataService dataService ,IEmployeeChangeLogService employeeChangeLogService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;
        }
        public async Task<int> Handle(AddEmployeeFamilyCommand request, CancellationToken cancellationToken)
        {
            var EmployeeFamily = new EmployeeFamily
            {
                EmployeeId = request.EmployeeId,
                FirstName = request.FirstName,
                MiddleName = request.MiddleName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                FatherFullName = request.FatherFullName,
                MotherFullName = request.MotherFullName,
                Gender = request.Gender,
                ApprovalStatus=ApprovalStatus.Approved,
                familyType= request.familyType,
                WorkingFirm=request.WorkingFirm,
               SpouseIsWorking = request.SpouseIsWorking,
                IsParentLiving=request.IsParentLiving,
                 FamilyParentType =request.FamilyParentType,
                ParentLivelyHood=request.ParentLivelyHood,
                IsActive = ActivationEnum.Active,  
            };
            dataService.EmployeeFamilies.Add(EmployeeFamily);
            await dataService.SaveAsync(cancellationToken);
            await employeeChangeLogService.LogEmployeeFamilyChange(EmployeeFamily, ChangeType.Added, cancellationToken);

            return EmployeeFamily.Id;
        }

    }
}
