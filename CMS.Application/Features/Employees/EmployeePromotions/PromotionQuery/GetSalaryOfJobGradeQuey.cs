using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionModel;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeePromotions.PromotionQuery
{
    public record GetSalaryOfJobGradeQuey(int? gradeId,int? salarytype,int? step,int? stepId) : IRequest<Decimal>;
    public class GetSalaryOfJobGradeQueyHandler : IRequestHandler<GetSalaryOfJobGradeQuey, Decimal>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetSalaryOfJobGradeQueyHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<Decimal> Handle(GetSalaryOfJobGradeQuey request, CancellationToken cancellationToken)
        {
            var salary = await dataService.JobGrades
    .Include(g => g.Steps)
    .FirstOrDefaultAsync(g => g.JobGradeId == request.gradeId);


            if (salary == null)
                return 0; // or throw exception

            if (request.salarytype == 1)
            {
                return salary.BaseSalary;
            }

            if (request.salarytype == 2)
            {
                return salary.CeilingSalary ?? 0; // handle nullable
            }

            if (request.salarytype == 3 && request.step != null)
            {
                var step = salary.Steps.FirstOrDefault(st => st.Id == request.stepId);
                return step?.SalaryAmount ?? 0;
            }

            return 0;

        }
    }
  }
