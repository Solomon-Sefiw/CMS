using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
public record EmployeeFamilySearchResult(List<EmployeeFamilyDto> Items, int TotalCount);
public record GetEmployeeFamilySearchResultListQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<EmployeeFamilySearchResult>;
public class GetEmployeeFamilyListQueryHandler : IRequestHandler<GetEmployeeFamilySearchResultListQuery, EmployeeFamilySearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;
    public GetEmployeeFamilyListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }
    public async Task<EmployeeFamilySearchResult> Handle(GetEmployeeFamilySearchResultListQuery request, CancellationToken cancellationToken)
    {
        var EmployeeFamilyList = await dataService.EmployeeFamilies.ToListAsync(cancellationToken);
        var EmployeeList = await dataService.Employees.ToListAsync(cancellationToken);

        var newEmployeeFamilyList = new List<EmployeeFamilyDto>();
        foreach (var EmpFamily in EmployeeFamilyList)
        {
            var Employee = EmployeeList.Where(EC => EC.Id == EmpFamily.EmployeeId).FirstOrDefault();
            var  EmployeeFamily= new EmployeeFamilyDto()
            {
                Id = EmpFamily.Id,         
            };
            newEmployeeFamilyList.Add(EmployeeFamily);
        }
        if (request.Status == ApprovalStatus.Submitted)
        {
            var result = newEmployeeFamilyList.Where(EC => EC.ApprovalStatus == ApprovalStatus.Submitted)
                                            .Skip((request.PageNumber-1)*request.PageSize)
                                            .Take(request.PageSize)
                                            .ToList();
           
            var count = await dataService.
                EmployeeFamilies.Where(EC => EC.ApprovalStatus==ApprovalStatus.Submitted).CountAsync();
            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Rejected)
        {
            var result = newEmployeeFamilyList.Where(EC => EC.ApprovalStatus == ApprovalStatus.Rejected)
                                             .Skip((request.PageNumber - 1) * request.PageSize)
                                             .Take(request.PageSize)
                                             .ToList();
            var count = await dataService.EmployeeFamilies.Where(EC =>
                    EC.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Draft)
        {
            var result = newEmployeeFamilyList.Where(EC => EC.ApprovalStatus == ApprovalStatus.Draft)
                                        .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                        .ToList();
            var count = await dataService.EmployeeFamilies.Where(EC =>
                    EC.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(result, count);
        }
        else
        {
            var result = newEmployeeFamilyList.Where(EC => EC.ApprovalStatus == ApprovalStatus.Approved)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
            var count = await dataService.EmployeeFamilies.Where(EC =>
                        EC.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            return new(result, count);
        }
        return null;
    }
}
