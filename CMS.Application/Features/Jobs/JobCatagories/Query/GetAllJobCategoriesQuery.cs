using CMS.Application.Features.Jobs.JobCatagories.Model;
using MediatR;

namespace CMS.Application.Features.Jobs.JobCatagories.Query
{
    public record GetAllJobCategoriesQuery() : IRequest<JobCategoryLists>;
    public record JobCategoryLists(
    IEnumerable<JobCategoryDto> Approved,
    IEnumerable<JobCategoryDto> Submitted,
    IEnumerable<JobCategoryDto> Rejected,
    IEnumerable<JobCategoryDto> Draft
    );
}
