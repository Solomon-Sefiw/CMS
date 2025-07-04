using AutoMapper;
using CMS.Application.Features.Employees;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Guranters.Commands
{
    public class ActivateEmployeeGurantersCommandHandler : IRequestHandler<ActivateEmployeeGurantersCommand, int>
    {
        private readonly IDataService dataService;
        public ActivateEmployeeGurantersCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ActivateEmployeeGurantersCommand request, CancellationToken cancellationToken)
        {
            var employeeGuarantor = await dataService.EmployeeGuranteries.Where(EG=>EG.Id==request.Id && EG.EmployeeId==request.EmployeeId).FirstAsync();
            employeeGuarantor.Active = ActivationEnum.Active;
            employeeGuarantor.comment = request.comment;
            dataService.EmployeeGuranteries.Update(employeeGuarantor);
            await dataService.SaveAsync(cancellationToken);
            return employeeGuarantor.Id;
        }

    }
}
