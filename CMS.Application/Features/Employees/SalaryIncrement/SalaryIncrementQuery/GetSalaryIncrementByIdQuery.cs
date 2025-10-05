
using AutoMapper;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetSalaryIncrementByIdQuery(int Id) : IRequest<EmployeeSalaryIncrement>;
public class GetSalaryIncrementByIdHandler : IRequestHandler<GetSalaryIncrementByIdQuery, EmployeeSalaryIncrement>
{
    public readonly IDataService dataService;
    public readonly IMapper mapper;
    public GetSalaryIncrementByIdHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<EmployeeSalaryIncrement> Handle(GetSalaryIncrementByIdQuery request, CancellationToken cancellationToken)
    {
        var employeeSalaryIncrement = await dataService.EmployeeSalaryIncrements
.SingleOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        var GetSalaryIncrement = new EmployeeSalaryIncrement
        {
            Id = employeeSalaryIncrement.Id,
            EmployeeId = employeeSalaryIncrement.EmployeeId,
            JobRoleId = employeeSalaryIncrement.JobRoleId,
            SalaryIncrementDate = employeeSalaryIncrement.SalaryIncrementDate,
            SalaryIncrementEndDate = employeeSalaryIncrement.SalaryIncrementEndDate,
            BeforeGradeSalaryStepId = employeeSalaryIncrement.BeforeGradeSalaryStepId,
            AfterGradeSalaryStepId = employeeSalaryIncrement.AfterGradeSalaryStepId,
            Remark = employeeSalaryIncrement.Remark,
            TransactionStatus = employeeSalaryIncrement.TransactionStatus,

        };
        return GetSalaryIncrement;
    }
}

