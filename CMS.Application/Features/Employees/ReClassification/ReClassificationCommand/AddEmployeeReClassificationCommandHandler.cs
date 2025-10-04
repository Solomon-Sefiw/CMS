using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Core;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

    public class AddEmployeeReClassificationCommandHandler : IRequestHandler<AddEmployeeReClassificationCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public AddEmployeeReClassificationCommandHandler(IDataService dataService,IMapper mapper) { 
         this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(AddEmployeeReClassificationCommand command, CancellationToken cancellationToken)
        {
            var reclassifcation = new EmployeeReClassification
            {
                EmployeeId = command.EmployeeId,
                ReClassificationDate = command.ReClassificationDate,
                ReClassificationEndDate = command.ReClassificationEndDate,
                JobRoleBeforeId = command.JobRoleBeforeId,
                JobRoleAfterId = command.JobRoleAfterId,
                ReClassificationType = command.ReClassificationType,
      
                Remark = command.Remark,

                TransactionStatus=EmployeeTransactionStatus.Draft,
            };
            await dataService.EmployeeReClassifications.AddAsync(reclassifcation, cancellationToken);
            await dataService.SaveAsync(cancellationToken);

            return reclassifcation.Id;
        }

    }

