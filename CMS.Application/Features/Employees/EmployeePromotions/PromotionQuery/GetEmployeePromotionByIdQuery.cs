
using AutoMapper;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeePromotions.PromotionQuery
{
    public record GetEmployeePromotionByIdQuery(int Id) : IRequest<EmployeePromotion>;
    public class GetEmployeePromotionByIdHandler : IRequestHandler<GetEmployeePromotionByIdQuery, EmployeePromotion>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeePromotionByIdHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<EmployeePromotion> Handle(GetEmployeePromotionByIdQuery request, CancellationToken cancellationToken)
        {
            var employeePromotion = await dataService.EmployeePromotions
    .Include(p => p.BusinessUnitBefore)
    .Include(p => p.BusinessUnitAfter)
    .Include(p => p.JobRoleAfter)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .Include(p => p.JobRoleBefore)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .SingleOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                var Promotion = new EmployeePromotion
                {
         Id=employeePromotion.Id,
         EmployeeId = employeePromotion.EmployeeId,
         PromotionDate = employeePromotion.PromotionDate,
         PromotionEndDate = employeePromotion.PromotionEndDate,
         JobRoleBeforeId = employeePromotion.JobRoleBeforeId,
         JobRoleAfterId=employeePromotion.JobRoleAfterId,
         PromotionType=employeePromotion.PromotionType,
         BusinessUnitBeforeId = employeePromotion.BusinessUnitBeforeId,
         BusinessUnitAfterId = employeePromotion.BusinessUnitAfterId,
         Remark=employeePromotion.Remark,
         TransactionStatus=employeePromotion.TransactionStatus,
         JobRoleAfter=employeePromotion.JobRoleAfter,
        JobRoleBefore=employeePromotion.JobRoleBefore,
        BusinessUnitAfter = employeePromotion.BusinessUnitAfter,
        BusinessUnitBefore = employeePromotion.BusinessUnitBefore,
         BeforeGradeSalaryStepId = employeePromotion.BeforeGradeSalaryStepId,
         AfterGradeSalaryStepId = employeePromotion.AfterGradeSalaryStepId,
         IsBusinessUnitChange = employeePromotion.IsBusinessUnitChange,

                };
            return Promotion;
        }
    }
    }
