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
    public class AddEmployeeGurantersCommandHandler : IRequestHandler<AddEmployeeGurantersCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public AddEmployeeGurantersCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<int> Handle(AddEmployeeGurantersCommand request, CancellationToken cancellationToken)
        {
            var employeeGuarantor = new EmployeeGuranters
            {
                IdentificationCardNo = request.IdentificationCardNo,
                Name = request.Name,
                FathersName = request.FathersName,
                GrandfathersName = request.GrandfathersName,
                WorkingFirm = request.WorkingFirm,
                EmployeeId = request.EmployeeId,
                //
                Referenceno = request.Referenceno,
                Salary = request.Salary,
                GuaranteeType = request.GuaranteeType,
                Active = request.Active,
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                comment = request.comment,
                
            };
            dataService.EmployeeGuranteries.Add(employeeGuarantor);
            await dataService.SaveAsync(cancellationToken);
            return employeeGuarantor.Id;
        }

    }
}
