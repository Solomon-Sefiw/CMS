using System;
using AutoMapper;
using Azure;
using CMS.Application.Features.Employees;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Guranters.Commands
{
    public class UpdateEmployeeGurantersCommandHandler : IRequestHandler<UpdateEmployeeGurantersCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public UpdateEmployeeGurantersCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<int> Handle(UpdateEmployeeGurantersCommand request, CancellationToken cancellationToken)
        {
            var guarantor = await dataService.EmployeeGuranteries.FindAsync(request.Id);
       
            guarantor.IdentificationCardNo = request.IdentificationCardNo;
            guarantor.Name = request.Name;
            guarantor.FathersName = request.FathersName;
            guarantor.GrandfathersName = request.GrandfathersName;
            guarantor.WorkingFirm = request.WorkingFirm;
            guarantor.EmployeeId = request.EmployeeId;
            guarantor.Referenceno = request.Referenceno;
            guarantor.Salary = request.Salary;
            guarantor.GuaranteeType = request.GuaranteeType;
            guarantor.Active = request.Active;
            guarantor.FromDate = request.FromDate;
            guarantor.ToDate = request.ToDate;
            guarantor.comment = request.comment;



            await dataService.SaveAsync(cancellationToken);

            return guarantor.Id;
        }
    }
}
