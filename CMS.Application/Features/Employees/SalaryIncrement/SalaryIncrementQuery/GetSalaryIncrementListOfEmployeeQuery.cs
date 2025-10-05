using AutoMapper;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementModel;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementQuery
{
    public record GetSalaryIncrementListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeeSalaryIncrementDto>>;
    public class GetSalaryIncrementListOfEmployeeQueryHandler : IRequestHandler<GetSalaryIncrementListOfEmployeeQuery, List<EmployeeSalaryIncrementDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetSalaryIncrementListOfEmployeeQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeSalaryIncrementDto>> Handle(GetSalaryIncrementListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            var employeeSalarIncrement = await dataService.EmployeeSalaryIncrements
                    .Where(p => p.EmployeeId == request.EmployeeId)
               .ToListAsync();

            var employeeSalaryIncremenetList = new List<EmployeeSalaryIncrementDto>();

            foreach (var salaryIncrement in employeeSalarIncrement)
            {
                var SalaryIncrementDto = new EmployeeSalaryIncrementDto
                {
                    Id = salaryIncrement.Id,
                    EmployeeId = salaryIncrement.EmployeeId,
                    JobRole = salaryIncrement.JobRole.RoleName,
                    Grade = salaryIncrement.JobRole.JobGrade.JobGradeRomanId,
                    SalaryIncrementDate = salaryIncrement.SalaryIncrementDate,
                    SalaryIncrementEndDate = salaryIncrement.SalaryIncrementEndDate,
                    BeforeGradeSalaryStepId = salaryIncrement.BeforeGradeSalaryStepId,
                    AfterGradeSalaryStepId = salaryIncrement.AfterGradeSalaryStepId,
                    Remark = salaryIncrement.Remark,
                    TransactionStatus = salaryIncrement.TransactionStatus,
                };

                employeeSalaryIncremenetList.Add(SalaryIncrementDto);
            }

            return employeeSalaryIncremenetList;
        }
    }
}
