using AutoMapper;
using CMS.Application.Features;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

public record GetProbationCountPerApprovalStatusQuery() : IRequest<GetProbationCountsByStatus>;
public record GetProbationCountsByStatus(int ApprovalRequests,int ProbationState,int Rejected);

public class GetProbationCountPerApprovalStatusQueryHandler : IRequestHandler<GetProbationCountPerApprovalStatusQuery, GetProbationCountsByStatus>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetProbationCountPerApprovalStatusQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<GetProbationCountsByStatus> Handle(GetProbationCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var ProbationState = await dataService.Employees
                 .Where(a => a.EmployeeStatus == EmployeeStatusEnum.UnderProbation &&
                 a.ApprovalStatus == ApprovalStatus.Approved).Include(a => a.BusinessUnits)
                 .Include(a => a.Job).ThenInclude(a => a.JobRole)
        .ThenInclude(a => a.JobCatagory)
                 .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();
        //
        var ApprovalRequests = await dataService.Employees
                        .Where(a => a.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRequest &&
                        a.ApprovalStatus == ApprovalStatus.Approved)
                        .Include(a => a.BusinessUnits)
                        .Include(a => a.Job).ThenInclude(a => a.JobRole)
               .ThenInclude(a => a.JobCatagory)
                        .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();
        //
        var Rejected = await dataService.Employees
                      .Where(a => a.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRejected &&
                      a.ApprovalStatus == ApprovalStatus.Approved)
                      .Include(a => a.BusinessUnits)
                      .Include(a => a.Job).ThenInclude(a => a.JobRole)
             .ThenInclude(a => a.JobCatagory)
                      .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).CountAsync();


        return new(ApprovalRequests, ProbationState, Rejected);
    }
}
