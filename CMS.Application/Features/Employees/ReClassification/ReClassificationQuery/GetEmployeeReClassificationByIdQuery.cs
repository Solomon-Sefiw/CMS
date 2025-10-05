
using AutoMapper;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

    public record GetEmployeeReClassificationByIdQuery(int Id) : IRequest<EmployeeReClassification>;
    public class GetEmployeeReClassificationByIdHandler : IRequestHandler<GetEmployeeReClassificationByIdQuery, EmployeeReClassification>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeeReClassificationByIdHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<EmployeeReClassification> Handle(GetEmployeeReClassificationByIdQuery request, CancellationToken cancellationToken)
        {
            var employeeReClassification = await dataService.EmployeeReClassifications
    .Include(p => p.JobRoleAfter)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .Include(p => p.JobRoleBefore)
        .ThenInclude(j => j.JobGrade)
        .ThenInclude(g => g.Steps)
    .SingleOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
            var ReClassification = new EmployeeReClassification
            {
                Id = employeeReClassification.Id,
                ReClassificationDate = (DateOnly)employeeReClassification.ReClassificationDate,
                ReClassificationEndDate = employeeReClassification.ReClassificationEndDate,
                JobRoleBeforeId = employeeReClassification.JobRoleBeforeId,
                JobRoleAfterId = employeeReClassification.JobRoleAfterId,
                ReClassificationType = employeeReClassification.ReClassificationType,
               
                Remark = employeeReClassification.Remark,
                EmployeeId = employeeReClassification.EmployeeId,
              
                TransactionStatus = employeeReClassification.TransactionStatus,
                JobRoleAfter = employeeReClassification.JobRoleAfter,
                JobRoleBefore = employeeReClassification.JobRoleBefore,
               /* AfterGradeSalaryStepId = employeeReClassification.AfterGradeSalaryStepId,
                BeforeGradeSalaryStepId = employeeReClassification.BeforeGradeSalaryStepId,
                BusinessUnitBeforeId = employeeReClassification.BusinessUnitBeforeId,
                BusinessUnitAfterId = employeeReClassification.BusinessUnitAfterId,
                BusinessUnitAfter = employeeReClassification.BusinessUnitAfter,
                BusinessUnitBefore = employeeReClassification.BusinessUnitBefore,
                IsBusinessUnitChange=employeeReClassification.IsBusinessUnitChange,**/
            };
            return ReClassification;
        }
    }

