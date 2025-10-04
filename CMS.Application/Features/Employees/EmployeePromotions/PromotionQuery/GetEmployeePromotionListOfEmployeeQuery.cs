using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionModel;
using CMS.Application.Features.Employees.Experience.Model;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeePromotions.PromotionQuery
{
    public record GetEmployeePromotionListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeePromotionDto>>;
    public class GetEmployeePromotionListOfEmployeeHandler : IRequestHandler<GetEmployeePromotionListOfEmployeeQuery, List<EmployeePromotionDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeePromotionListOfEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeePromotionDto>> Handle(GetEmployeePromotionListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            var employeePromotion = await dataService.EmployeePromotions
                    .Where(p => p.EmployeeId == request.EmployeeId)
              .Include(p => p.BusinessUnitBefore)
             .Include(p => p.BusinessUnitAfter)
                 .Include(p => p.JobRoleAfter)
                 .ThenInclude(j => j.JobGrade)
                 .ThenInclude(g => g.Steps)
                 .Include(p => p.JobRoleBefore)
                 .ThenInclude(j => j.JobGrade)
                 .ThenInclude(g => g.Steps)
               .ToListAsync();

            var employeePromotionList = new List<EmployeePromotionDto>();

            foreach (var Promotion in employeePromotion)
            {
                var PromotionOnDto = new EmployeePromotionDto
                {
                   Id = Promotion.Id,
                  PromotionDate= (DateOnly)Promotion.PromotionDate,
                  PromotionEndDate= Promotion.PromotionEndDate,
                  JobRoleBefore= Promotion.JobRoleBefore.RoleName,
                  JobRoleAfter= Promotion.JobRoleAfter.RoleName,
                  PromotionType= Promotion.PromotionType,
                  BusinessUnitBefore= Promotion.BusinessUnitBefore.Name,
                  BusinessUnitAfter= Promotion.BusinessUnitAfter.Name,
                  Remark= Promotion.Remark,
                  EmployeeId=Promotion.EmployeeId,
                   BeforeGradeSalaryStepId = Promotion.BeforeGradeSalaryStepId,
                   AfterGradeSalaryStepId = Promotion.AfterGradeSalaryStepId,
                   IsBusinessUnitChange = Promotion.IsBusinessUnitChange,
                };

                employeePromotionList.Add(PromotionOnDto);
            }

            return employeePromotionList;
        }
    }
}
