using AutoMapper;
using Azure.Core;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class AddSalaryIncrementCommandHandler : IRequestHandler<AddSalaryIncrementCommand, int>
{
    private readonly IDataService dataService;
    private readonly IMapper mappper;
    public AddSalaryIncrementCommandHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mappper = mapper;
    }
    public async Task<int> Handle(AddSalaryIncrementCommand command, CancellationToken cancellationToken)
    {
        var SalaryIncrement = new EmployeeSalaryIncrement
        {
            EmployeeId = command.EmployeeId,
            JobRoleId = command.JobRoleId,
            SalaryIncrementDate = command.SalaryIncrementDate,
            SalaryIncrementEndDate = command.SalaryIncrementEndDate,
            BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId,
            AfterGradeSalaryStepId = command.AfterGradeSalaryStepId,
            Remark = command.Remark,
            TransactionStatus = EmployeeTransactionStatus.Draft,
        };
        await dataService.EmployeeSalaryIncrements.AddAsync(SalaryIncrement, cancellationToken);
        await dataService.SaveAsync(cancellationToken);

        return SalaryIncrement.Id;
    }

}

