using AutoMapper;
using CMS.Application.Features;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

public record GetEmployeeIDCountPerApprovalStatusQuery() : IRequest<GetEmployeeIDCountsByStatus>;
public record GetEmployeeIDCountsByStatus(int ApprovalRequests,int Draft,int Rejected,int IDGiven);

public class GetEmployeeIDCountPerApprovalStatusQueryHandler : IRequestHandler<GetEmployeeIDCountPerApprovalStatusQuery, GetEmployeeIDCountsByStatus>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetEmployeeIDCountPerApprovalStatusQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<GetEmployeeIDCountsByStatus> Handle(GetEmployeeIDCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var draft = await dataService.Employees
                 .Where(a => a.EmployeeStatus == EmployeeStatusEnum.Active &&
                 a.ApprovalStatus == ApprovalStatus.Approved && a.EmployeeIDCardStatus==EmployeeIDCardStatus.IDNotGiven)
                 .Include(a => a.BusinessUnits)
                 .Include(a => a.Job).ThenInclude(a => a.JobRole)
        .ThenInclude(a => a.JobCatagory)
                 .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();
        //
        var ApprovalRequests = await dataService.Employees
                        .Where(a => a.EmployeeStatus == EmployeeStatusEnum.Active &&
                 a.ApprovalStatus == ApprovalStatus.Approved && a.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRequest)
                        .Include(a => a.BusinessUnits)
                        .Include(a => a.Job).ThenInclude(a => a.JobRole)
               .ThenInclude(a => a.JobCatagory)
                        .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();
        //
        var Rejected = await dataService.Employees
                      .Where(a => a.EmployeeStatus == EmployeeStatusEnum.Active &&
                 a.ApprovalStatus == ApprovalStatus.Approved && a.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRejected)
                      .Include(a => a.BusinessUnits)
                      .Include(a => a.Job).ThenInclude(a => a.JobRole)
             .ThenInclude(a => a.JobCatagory)
                      .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();
        //
        var IDGiven = await dataService.Employees
                      .Where(a => a.EmployeeStatus == EmployeeStatusEnum.Active &&
                 a.ApprovalStatus == ApprovalStatus.Approved && a.EmployeeIDCardStatus == EmployeeIDCardStatus.IDGiven)
                      .Include(a => a.BusinessUnits)
                      .Include(a => a.Job).ThenInclude(a => a.JobRole)
             .ThenInclude(a => a.JobCatagory)
                      .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();


        return new(ApprovalRequests,draft, Rejected, IDGiven);
    }
}
