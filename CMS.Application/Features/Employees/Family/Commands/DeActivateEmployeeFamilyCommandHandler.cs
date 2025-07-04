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
    public class DeActivateEmployeeFamilyCommandHandler : IRequestHandler<DeActivateEmployeeFamilyCommand, int>
    {
        private readonly IDataService dataService;
        public DeActivateEmployeeFamilyCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(DeActivateEmployeeFamilyCommand request, CancellationToken cancellationToken)
        {
            var employee = await dataService.EmployeeFamilies
     .Where(EmployeeFamily => EmployeeFamily.Id == request.Id)
     .FirstOrDefaultAsync(cancellationToken);

            if (employee == null)
            {
                return -1;
            }

            employee.IsActive = ActivationEnum.InActive;
            employee.comment = request.comment;
            dataService.EmployeeFamilies.Update(employee);
            await dataService.SaveAsync(cancellationToken);
            return employee.Id;
        }

    }
}
