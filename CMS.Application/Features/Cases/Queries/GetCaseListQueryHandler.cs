using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.Queries
{
    public record GetCaseListQuery : IRequest<List<CaseDto>>;

    public class GetCaseListQueryHandler : IRequestHandler<GetCaseListQuery, List<CaseDto>>
    {
        private readonly IDataService dataService;

        public GetCaseListQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<List<CaseDto>> Handle(GetCaseListQuery query, CancellationToken cancellationToken)
        {
            var caseList = await dataService.Cases
                .Include(c => c.BusinessUnit)
                .Include(c => c.FiledBy)
                .Include(c => c.AssignedJudge)
                .Include(c => c.Chilot)
                .ToListAsync(cancellationToken);

            var newCaseList = new List<CaseDto>();

            foreach (var c in caseList)
            {
                var caseDto = new CaseDto
                {
                    Id = c.Id,
                    CaseNumber = c.CaseNumber,
                    CaseType = c.CaseType,
                    Status = c.Status,
                    PlaintiffName = c.PlaintiffName,
                    AccusedName = c.AccusedName,
                    Subject = c.Subject,
                    FiledAt = c.FiledAt,
                    ClosedAt = c.ClosedAt,
                    FiledById = c.FiledById,
                    FiledBy = c.FiledBy,
                    AssignedJudgeId = c.AssignedJudgeId,
                    AssignedJudge = c.AssignedJudge,
                    BusinessUnitId = c.BusinessUnitId,
                    BusinessUnit = c.BusinessUnit,
                    ChilotId = c.ChilotId,
                    Chilot = c.Chilot,
                    ApprovalStatus = c.ApprovalStatus,
                    VersionNumber = c.VersionNumber,
                    WorkflowComment = c.WorkflowComment
                };

                newCaseList.Add(caseDto);
            }

            return newCaseList;
        }
    }
}
