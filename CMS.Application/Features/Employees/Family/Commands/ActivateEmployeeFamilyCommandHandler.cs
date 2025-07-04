using System.ComponentModel.Design;
using AutoMapper;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.Family.Commands;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Family.Commands
{
    public class ActivateEmployeeFamilyCommandHandler : IRequestHandler<ActivateEmployeeFamilyCommand, int>
    {
        private readonly IDataService dataService;
        public ActivateEmployeeFamilyCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ActivateEmployeeFamilyCommand request, CancellationToken cancellationToken)
        {
            var employee = await dataService.EmployeeFamilies
               .Where(EmployeeFamily => EmployeeFamily.Id == request.Id)
               .FirstOrDefaultAsync();
            employee.IsActive = ActivationEnum.Active;
            employee.comment = request.comment;
            dataService.EmployeeFamilies.Update(employee);
            await dataService.SaveAsync(cancellationToken);
            return employee.Id;
        }

    }
}
