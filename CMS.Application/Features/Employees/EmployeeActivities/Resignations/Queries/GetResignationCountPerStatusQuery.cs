using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Queries
{
    public record ResignationCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetResignationCountPerStatusQuery(int EmployeeId) : IRequest<ResignationCountsByStatus>;

    public class GetResignationCountPerStatusQueryHandler : IRequestHandler<GetResignationCountPerStatusQuery, ResignationCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetResignationCountPerStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ResignationCountsByStatus> Handle(GetResignationCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await dataService.Resignations.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Approved && r.EmployeeId == request.EmployeeId, cancellationToken);
            var submitted = await dataService.Resignations.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Submitted && r.EmployeeId == request.EmployeeId, cancellationToken);
            var rejected = await dataService.Resignations.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Rejected && r.EmployeeId == request.EmployeeId, cancellationToken);
            var draft = await dataService.Resignations.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Draft && r.EmployeeId == request.EmployeeId, cancellationToken);

            return new ResignationCountsByStatus(approved, submitted, rejected, draft);
        }
    }
}
