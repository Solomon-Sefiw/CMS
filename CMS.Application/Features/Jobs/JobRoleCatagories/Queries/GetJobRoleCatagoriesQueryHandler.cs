using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoleCatagories.Queries
{
    public record GetJobRoleCatagoriesQuery : IRequest<List<JobRoleCategory>>;
    internal class GetJobRoleCatagoriesQueryHandler : IRequestHandler<GetJobRoleCatagoriesQuery, List<JobRoleCategory>>
    {
        private readonly IDataService dataService;

        public GetJobRoleCatagoriesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<JobRoleCategory>> Handle(GetJobRoleCatagoriesQuery request, CancellationToken cancellationToken)
        {
            return await dataService.JobRoleCatagories.ToListAsync(cancellationToken);
        }
    }
}
