using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.Queries
{
    // Return type (paginated cases)
    public record CaseSearchResult(List<CaseDto> Items, int TotalCount);

    // Query with pagination + filters + search
    public record GetCaseListWithPaginationQuery(
        ApprovalStatus Status,
        int PageNumber,
        int PageSize,
        string? SearchQuery
    ) : IRequest<CaseSearchResult>;

    public class GetCaseListWithPaginationQueryHandler : IRequestHandler<GetCaseListWithPaginationQuery, CaseSearchResult>
    {
        private readonly IDataService _dataService;

        public GetCaseListWithPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<CaseSearchResult> Handle(GetCaseListWithPaginationQuery query, CancellationToken cancellationToken)
        {
            var caseQuery = _dataService.Cases.AsQueryable();


            // Apply Approval Status filter
            caseQuery = caseQuery.Where(c => c.ApprovalStatus == query.Status);

            // Search filter
            if (!string.IsNullOrWhiteSpace(query.SearchQuery))
            {
                var lowerCaseSearchQuery = query.SearchQuery.ToLower();

                caseQuery = caseQuery.Where(c =>
                    (c.CaseNumber != null && c.CaseNumber.ToLower().Contains(lowerCaseSearchQuery)) ||
                    (c.PlaintiffName != null && c.PlaintiffName.ToLower().Contains(lowerCaseSearchQuery)) ||
                    (c.AccusedName != null && c.AccusedName.ToLower().Contains(lowerCaseSearchQuery)) ||
                    (c.Subject != null && c.Subject.ToLower().Contains(lowerCaseSearchQuery)) ||
                    (c.BusinessUnit != null && c.BusinessUnit.Name.ToLower().Contains(lowerCaseSearchQuery))
                );
            }

            // Count total after filtering
            var totalCount = await caseQuery.CountAsync(cancellationToken);

            // Apply pagination
            var paginatedCases = await caseQuery
                .Include(c => c.BusinessUnit)
                .Include(c => c.AssignedJudge)
                .Include(c => c.FiledBy)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs
            var caseDtos = paginatedCases.Select(c => new CaseDto
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
            }).ToList();

            return new CaseSearchResult(caseDtos, totalCount);
        }
    }
}
