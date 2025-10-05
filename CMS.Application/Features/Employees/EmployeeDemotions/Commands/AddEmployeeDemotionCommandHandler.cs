using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Core;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class AddEmployeeDemotionCommandHandler:IRequestHandler<AddEmployeeDemotionCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public AddEmployeeDemotionCommandHandler(IDataService dataService,IMapper mapper) { 
         this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(AddEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            var demotion = new EmployeeDemotion
            {
                EmployeeId = command.EmployeeId,
                DemotionDate = command.DemotionDate,
                DemotionEndDate = command.DemotionEndDate,
                JobRoleBeforeId = command.JobRoleBeforeId,
                JobRoleAfterId = command.JobRoleAfterId,
                DemotionType = command.DemotionType,
                BusinessUnitBeforeId = command.BusinessUnitBeforeId,
                BusinessUnitAfterId = command.BusinessUnitAfterId,
                IsBusinessUnitChange = command.IsBusinessUnitChange,
                BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId,
                AfterGradeSalaryStepId = command.AfterGradeSalaryStepId,
                Remark = command.Remark,
                TransactionStatus = EmployeeTransactionStatus.Draft,
            };

           
            // Add to the context
            await dataService.EmployeeDemotions.AddAsync(demotion, cancellationToken);
            await dataService.SaveAsync(cancellationToken);
            return demotion.Id;
        }

    }
}
