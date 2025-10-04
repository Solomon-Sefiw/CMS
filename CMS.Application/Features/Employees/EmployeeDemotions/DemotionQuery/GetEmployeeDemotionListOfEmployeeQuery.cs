using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Employees.EmployeeDemotions.DemotionModel;
using CMS.Application.Features.Employees.Experience.Model;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeDemotions.DemotionQuery
{
    public record GetEmployeeDemotionListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeeDemotionDto>>;
    public class GetEmployeeDemotionListOfEmployeeHandler : IRequestHandler<GetEmployeeDemotionListOfEmployeeQuery, List<EmployeeDemotionDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeeDemotionListOfEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeDemotionDto>> Handle(GetEmployeeDemotionListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var employeeDemotion = await dataService.EmployeeDemotions
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
            


            var employeeDemotionList = new List<EmployeeDemotionDto>();

            foreach (var Demotion in employeeDemotion)
            {
                var DemotionOnDto = new EmployeeDemotionDto
                {
                    Id = Demotion.Id,
                    DemotionDate = (DateOnly)Demotion.DemotionDate,
                    DemotionEndDate = Demotion.DemotionEndDate,
                    JobRoleBefore = Demotion.JobRoleBefore.RoleName,
                    JobRoleAfter = Demotion.JobRoleAfter.RoleName,
                    DemotionType = Demotion.DemotionType,
                    BusinessUnitBefore = Demotion.BusinessUnitBefore.Name,
                    BusinessUnitAfter = Demotion.BusinessUnitAfter.Name,
                    Remark = Demotion.Remark,
                    EmployeeId = Demotion.EmployeeId,
                    TransactionStatus = Demotion.TransactionStatus,
                };

                employeeDemotionList.Add(DemotionOnDto);
            }
        
            
            return employeeDemotionList;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;

            }
        }
    }
}
