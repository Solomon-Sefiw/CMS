using AutoMapper;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record EmployeeReClassificationSearchResult(List<EmployeeReClassificationDto> Items, int TotalCount);
public record GetEmployeeReClassificationListQuery(EmployeeTransactionStatus Status, int PageNumber, int PageSize,int EmployeeId) : IRequest<EmployeeReClassificationSearchResult>;
public class GetEmployeeReClassificationListQueryHandler : IRequestHandler<GetEmployeeReClassificationListQuery, EmployeeReClassificationSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetEmployeeReClassificationListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<EmployeeReClassificationSearchResult> Handle(GetEmployeeReClassificationListQuery request, CancellationToken cancellationToken)
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
            var ReClassificationNew = new EmployeeReClassificationDto
            {
                Id = ReClassification.Id,
                ReClassificationDate = (DateOnly)ReClassification.ReClassificationDate,
                ReClassificationEndDate = ReClassification.ReClassificationEndDate,
                JobRoleBefore = ReClassification.JobRoleBefore.RoleName,
                JobRoleAfter = ReClassification.JobRoleAfter.RoleName,
                ReClassificationType = ReClassification.ReClassificationType,
               
                Remark = ReClassification.Remark,
                EmployeeId = ReClassification.EmployeeId,
               /* AfterGradeSalaryStepId = ReClassification.AfterGradeSalaryStepId,
                BeforeGradeSalaryStepId = ReClassification.BeforeGradeSalaryStepId,
                IsBusinessUnitChange = ReClassification.IsBusinessUnitChange,
                BusinessUnitBefore = ReClassification.BusinessUnitBefore.Name,
                BusinessUnitAfter = ReClassification.BusinessUnitAfter.Name,**/
                TransactionStatus = ReClassification.TransactionStatus,
            };

            employeeReClassificationList.Add(ReClassificationNew);
        }
            List<EmployeeReClassificationDto> result;
            int count;
            if (request.Status == EmployeeTransactionStatus.Submitted)
            {
                result = employeeReClassificationList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeReClassifications
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Submitted)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Rejected)
            {
                result = employeeReClassificationList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeReClassifications
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Rejected)
                    .CountAsync();
            }
            else if (request.Status == EmployeeTransactionStatus.Draft)
            {
                result = employeeReClassificationList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeReClassifications
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Draft)
                    .CountAsync();
            }
            else
            {
                result = employeeReClassificationList
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                count = await dataService.EmployeeReClassifications
                    .Where(jr => jr.TransactionStatus == EmployeeTransactionStatus.Approved)
                    .CountAsync();
            }
        
        return new EmployeeReClassificationSearchResult(result, count);
    }
}