using AutoMapper;
using Azure;
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
    public class UpdateEmployeeFamilyCommandHandler : IRequestHandler<UpdateEmployeeFamilyCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService changeLogService;
        public UpdateEmployeeFamilyCommandHandler(IMapper mapper, IDataService dataService, IEmployeeChangeLogService employeeChangeLogService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
            this.changeLogService = employeeChangeLogService;
        }
        public async Task<int> Handle(UpdateEmployeeFamilyCommand request, CancellationToken cancellationToken)
        {
            var family = await dataService.EmployeeFamilies.FindAsync(request.Id);
            family.EmployeeId = request.EmployeeId;
            family.FirstName = request.FirstName;
            family.MiddleName = request.MiddleName;
            family.LastName = request.LastName;
            family.DateOfBirth = request.DateOfBirth;
            family.FatherFullName = request.FatherFullName;
            family.MotherFullName = request.MotherFullName;
            family.Gender = request.Gender;
            family.familyType = request.FamilyType;
            family.WorkingFirm = request.WorkingFirm;
            family.SpouseIsWorking = request.SpouseIsWorking;
            family.IsParentLiving=request.IsParentLiving;
            family.FamilyParentType = request.FamilyParentType;
            family.ParentLivelyHood = request.ParentLivelyHood;
            family.IsActive = ActivationEnum.Active;
            await dataService.SaveAsync(cancellationToken);
            await changeLogService.LogEmployeeFamilyChange(family, ChangeType.Modified, cancellationToken);

            return family.Id;
        }

    }
}
