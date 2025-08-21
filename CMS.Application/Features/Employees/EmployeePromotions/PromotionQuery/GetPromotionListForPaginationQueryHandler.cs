using AutoMapper;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionModel;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record EmployeePromotionSearchResult(List<EmployeePromotionDto> Items, int TotalCount);
public record GetEmployeePromotionListQuery(EmployeeTransactionStatus Status, int PageNumber, int PageSize,int EmployeeId) : IRequest<EmployeePromotionSearchResult>;
public class GetEmployeePromotionListQueryHandler : IRequestHandler<GetEmployeePromotionListQuery, EmployeePromotionSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetEmployeePromotionListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<EmployeePromotionSearchResult> Handle(GetEmployeePromotionListQuery request, CancellationToken cancellationToken)
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
                PromotionDate = (DateOnly)Promotion.PromotionDate,
                PromotionEndDate = Promotion.PromotionEndDate,
                JobRoleBefore = Promotion.JobRoleBefore.RoleName,
                JobRoleAfter = Promotion.JobRoleAfter.RoleName,
                PromotionType = Promotion.PromotionType,
                BusinessUnitBefore = Promotion.BusinessUnitBefore.Name,
                BusinessUnitAfter = Promotion.BusinessUnitAfter.Name,
                BeforeGradeSalaryStepId = Promotion.BeforeGradeSalaryStepId,
                AfterGradeSalaryStepId = Promotion.AfterGradeSalaryStepId,
                IsBusinessUnitChange = Promotion.IsBusinessUnitChange,
                Remark = Promotion.Remark,
                EmployeeId = Promotion.EmployeeId,
                TransactionStatus = Promotion.TransactionStatus,
            };

            employeePromotionList.Add(PromotionOnDto);
        }
            List<EmployeePromotionDto> result;
            int count;
            if (request.Status == EmployeeTransactionStatus.Submitted)
            {
                result = employeePromotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeePromotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Rejected)
            {
                result = employeePromotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeePromotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Draft)
            {
                result = employeePromotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeePromotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .CountAsync();
            }
            else
            {
                result = employeePromotionList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeePromotions
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .CountAsync();
            }
        
        return new EmployeePromotionSearchResult(result, count);
    }
}