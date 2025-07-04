using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetJobGradesCountPerApprovalStatusQuery() : IRequest<JobGradesCountsByStatus>;
public record JobGradesCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetJobGradesCountPerApprovalStatusQueryHandler : IRequestHandler<GetJobGradesCountPerApprovalStatusQuery, JobGradesCountsByStatus>
{
    private readonly IDataService dataService;

    public GetJobGradesCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<JobGradesCountsByStatus> Handle(GetJobGradesCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.JobGrades.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Approved).CountAsync();
        var approvalRequests = await dataService.JobGrades.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Submitted).CountAsync();
        var rejected = await dataService.JobGrades.Where(JR=>JR.ApprovalStatus==ApprovalStatus.Rejected).CountAsync();
        var draft = await dataService.JobGrades.Where(bu=>bu.ApprovalStatus==ApprovalStatus.Draft).CountAsync();
        return new(approved, approvalRequests, rejected, draft);
    }
}
