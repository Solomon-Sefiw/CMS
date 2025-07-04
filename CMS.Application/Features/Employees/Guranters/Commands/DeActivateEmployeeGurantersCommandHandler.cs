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
    public class DeActivateEmployeeGurantersCommandHandler : IRequestHandler<DeActivateEmployeeGurantersCommand, int>
    {
        private readonly IDataService dataService;
        public DeActivateEmployeeGurantersCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(DeActivateEmployeeGurantersCommand request, CancellationToken cancellationToken)
        {

            var employeeGuarantor = await dataService.EmployeeGuranteries.Where(EG => EG.Id == request.Id && EG.EmployeeId==request.EmployeeId).FirstAsync();
            employeeGuarantor.Active = ActivationEnum.InActive;
            employeeGuarantor.comment = request.comment;
            dataService.EmployeeGuranteries.Update(employeeGuarantor);
            await dataService.SaveAsync(cancellationToken);
            return employeeGuarantor.Id; 


        }

    }
}
