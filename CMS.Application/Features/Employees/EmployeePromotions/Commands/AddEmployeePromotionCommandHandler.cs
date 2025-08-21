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

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class AddEmployeePromotionCommandHandler:IRequestHandler<AddEmployeePromotionCommand,int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public AddEmployeePromotionCommandHandler(IDataService dataService,IMapper mapper) { 
         this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(AddEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            var promotion = new EmployeePromotion
            {
                EmployeeId = command.EmployeeId,
                PromotionDate = command.PromotionDate,
                PromotionEndDate = command.PromotionEndDate,
                JobRoleBeforeId = command.JobRoleBeforeId,
                JobRoleAfterId = command.JobRoleAfterId,
                PromotionType = command.PromotionType,
                BusinessUnitBeforeId = command.BusinessUnitBeforeId,
                BusinessUnitAfterId = command.BusinessUnitAfterId,
            
                Remark = command.Remark,
                IsBusinessUnitChange=command.IsBusinessUnitChange,
                BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId,
                AfterGradeSalaryStepId = command.AfterGradeSalaryStepId,

                TransactionStatus = EmployeeTransactionStatus.Draft,
            };
            await dataService.EmployeePromotions.AddAsync(promotion, cancellationToken);
            await dataService.SaveAsync(cancellationToken);

            return promotion.Id;
        }

    }
}
