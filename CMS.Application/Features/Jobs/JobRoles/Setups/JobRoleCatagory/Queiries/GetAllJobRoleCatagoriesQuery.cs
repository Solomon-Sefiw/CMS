using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries
{
    public record GetAllJobRoleCatagoriesQuery() : IRequest<JobRoleCatagoryLists>;
    public record JobRoleCatagoryLists(
    IEnumerable<JobRoleCatagoryDto> Approved,
    IEnumerable<JobRoleCatagoryDto> Submitted,
    IEnumerable<JobRoleCatagoryDto> Rejected,
    IEnumerable<JobRoleCatagoryDto> Draft
    );
}
