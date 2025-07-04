using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetJobRolesCountPerApprovalStatusQuery() : IRequest<JobRolesCountsByStatus>;
public record JobRolesCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetJobRolesCountPerApprovalStatusQueryHandler : IRequestHandler<GetJobRolesCountPerApprovalStatusQuery, JobRolesCountsByStatus>
{
    private readonly IDataService dataService;

    public GetJobRolesCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<JobRolesCountsByStatus> Handle(GetJobRolesCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.JobRoles.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Approved).CountAsync();
        var approvalRequests = await dataService.JobRoles.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Submitted).CountAsync();
        var rejected = await dataService.JobRoles.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Rejected).CountAsync();
        var draft = await dataService.JobRoles.Where(bu=>bu.ApprovalStatus==ApprovalStatus.Draft).CountAsync();
        return new(approved, approvalRequests, rejected, draft);
    }
}
