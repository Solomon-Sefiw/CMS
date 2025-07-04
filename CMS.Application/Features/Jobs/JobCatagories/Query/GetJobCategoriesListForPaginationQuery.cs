using AutoMapper;
using CMS.Application.Features.Jobs.JobCatagories.Model;
using CMS.Application.Features.Jobs.JobCatagories.Query;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Query
{
    public record JobCategorySearchResult(List<JobCategoryDto> Items, int TotalCount);

    public record GetJobCategoriesListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize)
        : IRequest<JobCategorySearchResult>;
}
public class GetJobCategoriesListQueryHandler : IRequestHandler<GetJobCategoriesListForPaginationQuery, JobCategorySearchResult>
{
    private readonly IDataService _dataService;
    private readonly IMapper _mapper;

    public GetJobCategoriesListQueryHandler(IDataService dataService, IMapper mapper)
    {
        _dataService = dataService;
        _mapper = mapper;
    }

    public async Task<JobCategorySearchResult> Handle(GetJobCategoriesListForPaginationQuery request, CancellationToken cancellationToken)
    {
        // Filter by status
        var query = _dataService.JobCatagories
            .Where(jc => jc.ApprovalStatus == request.Status)
            .OrderBy(jc => jc.JobCategoryName);

        // Count total
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination
        var pagedCategories = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Map to DTO
        var result = pagedCategories.Select(jc => new JobCategoryDto
        {
            Id = jc.Id,
            JobCategoryName = jc.JobCategoryName,
            ProbationPeriodInDays=jc.ProbationPeriodInDays,
            LastModifiedAt = jc.LastModifiedAt,
            ApprovalStatus = jc.ApprovalStatus,
            IsActive = jc.IsActive,
        }).ToList();

        return new JobCategorySearchResult(result, totalCount);
    }
}
