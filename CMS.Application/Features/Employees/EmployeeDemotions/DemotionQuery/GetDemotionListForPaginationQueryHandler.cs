using AutoMapper;
using CMS.Application.Features.Employees.EmployeeDemotions.DemotionModel;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeDemotions.DemotionQuery
{
    public record EmployeeDemotionSearchResult(List<EmployeeDemotionDto> Items, int TotalCount);
    public record GetEmployeeDemotionListQuery(EmployeeTransactionStatus Status, int PageNumber, int PageSize, int EmployeeId) : IRequest<EmployeeDemotionSearchResult>;
    public class GetEmployeeDemotionListQueryHandler : IRequestHandler<GetEmployeeDemotionListQuery, EmployeeDemotionSearchResult>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public GetEmployeeDemotionListQueryHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<EmployeeDemotionSearchResult> Handle(GetEmployeeDemotionListQuery request, CancellationToken cancellationToken)
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
                var DemotionView = new EmployeeDemotionDto
                {
                    Id = Demotion.Id,
                    DemotionDate = (DateOnly)Demotion.DemotionDate,
                    DemotionEndDate = Demotion.DemotionEndDate,
                    JobRoleBefore = Demotion.JobRoleBefore.RoleName,
                    JobRoleAfter = Demotion.JobRoleAfter.RoleName,
                    DemotionType = Demotion.DemotionType,
                    BusinessUnitBefore = Demotion.BusinessUnitBefore.Name,
                    BusinessUnitAfter = Demotion.BusinessUnitAfter.Name,
                    AfterGradeSalaryStepId = Demotion.AfterGradeSalaryStepId,
                    BeforeGradeSalaryStepId = Demotion.BeforeGradeSalaryStepId,
                    IsBusinessUnitChange= Demotion.IsBusinessUnitChange,
                    Remark = Demotion.Remark,
                    EmployeeId = Demotion.EmployeeId,
                    TransactionStatus = Demotion.TransactionStatus,
                };

                employeeDemotionList.Add(DemotionView);
            }
            List<EmployeeDemotionDto> result;
            int count;
            if (request.Status == EmployeeTransactionStatus.Submitted)
            {
                result = employeeDemotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeDemotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Rejected)
            {
                result = employeeDemotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeDemotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Draft)
            {
                result = employeeDemotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeDemotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .CountAsync();
            }
            else
            {
                result = employeeDemotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeDemotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .CountAsync();
            }

            return new EmployeeDemotionSearchResult(result, count);
        }
    }
}