using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationQuery
{
    public record GetEmployeeReClassificationListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeeReClassificationDto>>;
    public class GetEmployeeReClassificationListOfEmployeeHandler : IRequestHandler<GetEmployeeReClassificationListOfEmployeeQuery, List<EmployeeReClassificationDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeeReClassificationListOfEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeReClassificationDto>> Handle(GetEmployeeReClassificationListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            var employeeReClassification = await dataService.EmployeeReClassifications
                    .Where(p => p.EmployeeId == request.EmployeeId)
                 .Include(p => p.JobRoleAfter)
                 .ThenInclude(j => j.JobGrade)
                 .ThenInclude(g => g.Steps)
                 .Include(p => p.JobRoleBefore)
                 .ThenInclude(j => j.JobGrade)
                 .ThenInclude(g => g.Steps)
               .ToListAsync();

            var employeeReClassificationList = new List<EmployeeReClassificationDto>();

            foreach (var ReClassification in employeeReClassification)
            {
                var ReClassificationDto = new EmployeeReClassificationDto
                {
                   Id = ReClassification.Id,
                    ReClassificationDate = (DateOnly)ReClassification.ReClassificationDate,
                    ReClassificationEndDate = ReClassification.ReClassificationEndDate,
                    JobRoleBefore= ReClassification.JobRoleBefore.RoleName,
                    JobRoleAfter= ReClassification.JobRoleAfter.RoleName,
                    ReClassificationType = ReClassification.ReClassificationType,
                   
                    Remark= ReClassification.Remark,
                    EmployeeId= ReClassification.EmployeeId,
              /*      AfterGradeSalaryStepId = ReClassification.AfterGradeSalaryStepId,
                    BeforeGradeSalaryStepId = ReClassification.BeforeGradeSalaryStepId,
                    IsBusinessUnitChange= ReClassification.IsBusinessUnitChange,
                    BusinessUnitBefore = ReClassification.BusinessUnitBefore.Name,
                    BusinessUnitAfter = ReClassification.BusinessUnitAfter.Name,**/
                    TransactionStatus = ReClassification.TransactionStatus,
                };

                employeeReClassificationList.Add(ReClassificationDto);
            }

            return employeeReClassificationList;
        }
    }
}
