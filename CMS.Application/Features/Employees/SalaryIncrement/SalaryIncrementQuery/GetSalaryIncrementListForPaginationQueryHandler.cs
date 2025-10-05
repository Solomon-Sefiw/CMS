using AutoMapper;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementModel;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record EmployeeSalaryIncrementSearchResult(List<EmployeeSalaryIncrementDto> Items, int TotalCount);
public record GetEmployeeSalaryIncrementListQuery(EmployeeTransactionStatus Status, int PageNumber, int PageSize, int EmployeeId) : IRequest<EmployeeSalaryIncrementSearchResult>;
public class GetEmployeeSalaryIncrementListQueryHandler : IRequestHandler<GetEmployeeSalaryIncrementListQuery, EmployeeSalaryIncrementSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetEmployeeSalaryIncrementListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<EmployeeSalaryIncrementSearchResult> Handle(GetEmployeeSalaryIncrementListQuery request, CancellationToken cancellationToken)
    {

        var employeeSalaryIncrement = await dataService.EmployeeSalaryIncrements.Include(J=>J.JobRole).ThenInclude(G=>G.JobGrade)
                .Where(p => p.EmployeeId == request.EmployeeId)
           .ToListAsync();

        var employeeSalaryIncrementList = new List<EmployeeSalaryIncrementDto>();
        foreach (var salaryIncrement in employeeSalaryIncrement)
        {
            var salaryIncrementNew = new EmployeeSalaryIncrementDto
            {
                Id=salaryIncrement.Id,
            EmployeeId= salaryIncrement.EmployeeId,
            JobRole =salaryIncrement.JobRole.RoleName,
            Grade= salaryIncrement.JobRole.JobGrade.JobGradeRomanId,
            SalaryIncrementDate = salaryIncrement.SalaryIncrementDate,
            SalaryIncrementEndDate= salaryIncrement.SalaryIncrementEndDate,
            BeforeGradeSalaryStepId= salaryIncrement.BeforeGradeSalaryStepId,
            AfterGradeSalaryStepId= salaryIncrement.AfterGradeSalaryStepId,
            Remark= salaryIncrement.Remark,
            TransactionStatus= salaryIncrement.TransactionStatus,
            };

            employeeSalaryIncrementList.Add(salaryIncrementNew);
        }
        List<EmployeeSalaryIncrementDto> result;
        int count;
        if (request.Status == EmployeeTransactionStatus.Submitted)
        {
            result = employeeSalaryIncrementList
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.EmployeeSalaryIncrements
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                .CountAsync();
        }
        else if (request.Status == EmployeeTransactionStatus.Rejected)
        {
            result = employeeSalaryIncrementList
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.EmployeeSalaryIncrements
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                .CountAsync();
        }
        else if (request.Status == EmployeeTransactionStatus.Draft)
        {
            result = employeeSalaryIncrementList
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.EmployeeSalaryIncrements
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                .CountAsync();
        }
        else
        {
            result = employeeSalaryIncrementList
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            count = await dataService.EmployeeSalaryIncrements
                .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                .CountAsync();
        }

        return new EmployeeSalaryIncrementSearchResult(result, count);
    }
}