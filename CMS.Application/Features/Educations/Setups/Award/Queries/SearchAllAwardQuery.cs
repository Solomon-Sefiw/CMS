using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.Award.Queries
{

    public record SearchAllAwardQuery : IRequest<List<AwardDto>>;
    internal class SearchAllAwardQueryHandler : IRequestHandler<SearchAllAwardQuery, List<AwardDto>>
    {
        private readonly IDataService dataService;

        public SearchAllAwardQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<AwardDto>> Handle(SearchAllAwardQuery request, CancellationToken cancellationToken)
        {
            var awards = await dataService.Awards
                .Select(a => new AwardDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);
            return awards;
        }
    }
}
