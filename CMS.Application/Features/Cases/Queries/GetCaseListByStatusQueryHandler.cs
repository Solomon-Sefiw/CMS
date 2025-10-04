using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.Queries
{
    // Return grouped case list by ApprovalStatus
    public record CaseList(
        List<CaseDto> Approved,
        List<CaseDto> Submitted,
        List<CaseDto> Rejected,
        List<CaseDto> Draft
    );

    // Query
    public record GetCaseListByStatusQuery : IRequest<CaseList>;

    // Handler
    public class GetCaseListByStatusQueryHandler : IRequestHandler<GetCaseListByStatusQuery, CaseList>
    {
        private readonly IDataService dataService;

        public GetCaseListByStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<CaseList> Handle(GetCaseListByStatusQuery query, CancellationToken cancellationToken)
        {
            var caseList = await dataService.Cases.ToListAsync(cancellationToken);

            var newCaseList = new List<CaseDto>();
            var businessUnitList = await dataService.BusinessUnits.ToListAsync(cancellationToken);

            foreach (var c in caseList)
            {
                var businessUnit = businessUnitList.FirstOrDefault(bu => bu.Id == c.BusinessUnitId);

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
                    BusinessUnit = businessUnit,
                    ChilotId = c.ChilotId,
                    Chilot = c.Chilot,
                    ApprovalStatus = c.ApprovalStatus
                };

                newCaseList.Add(caseDto);
            }

            // Grouping by Approval Status
            var approved = newCaseList.Where(cs => cs.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = newCaseList.Where(cs => cs.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = newCaseList.Where(cs => cs.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = newCaseList.Where(cs => cs.ApprovalStatus == ApprovalStatus.Draft).ToList();

            return new CaseList(
                Approved: approved,
                Submitted: submitted,
                Rejected: rejected,
                Draft: draft
            );
        }
    }
}
