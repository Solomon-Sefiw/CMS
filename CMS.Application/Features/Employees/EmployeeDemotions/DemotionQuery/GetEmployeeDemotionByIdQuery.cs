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

namespace CMS.Application.Features.Employees.EmployeeDemotions.DemotionQuery
{
    public record GetEmployeeDemotionByIdQuery(int Id) : IRequest<EmployeeDemotion>;
    public class GetEmployeeDemotionByIdHandler : IRequestHandler<GetEmployeeDemotionByIdQuery,EmployeeDemotion>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeeDemotionByIdHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<EmployeeDemotion> Handle(GetEmployeeDemotionByIdQuery request, CancellationToken cancellationToken)
        {
            var employeeDemotion = await dataService.EmployeeDemotions
    .Include(p => p.BusinessUnitBefore)
    .Include(p => p.BusinessUnitAfter)
    .Include(p => p.JobRoleAfter)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .Include(p => p.JobRoleBefore)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .SingleOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                var demotion = new EmployeeDemotion
                {
         Id= employeeDemotion.Id,
         EmployeeId = employeeDemotion.EmployeeId,
         DemotionDate = employeeDemotion.DemotionDate,
         DemotionEndDate = employeeDemotion.DemotionEndDate,
         JobRoleBeforeId = employeeDemotion.JobRoleBeforeId,
         JobRoleAfterId= employeeDemotion.JobRoleAfterId,
                    DemotionType = employeeDemotion.DemotionType,
         BusinessUnitBeforeId = employeeDemotion.BusinessUnitBeforeId,
         BusinessUnitAfterId = employeeDemotion.BusinessUnitAfterId,
         Remark= employeeDemotion.Remark,
         TransactionStatus= employeeDemotion.TransactionStatus,
         JobRoleAfter= employeeDemotion.JobRoleAfter,
        JobRoleBefore= employeeDemotion.JobRoleBefore,
        BusinessUnitAfter = employeeDemotion.BusinessUnitAfter,
        BusinessUnitBefore = employeeDemotion.BusinessUnitBefore,
                };
            return demotion;
        }
    }
    }
