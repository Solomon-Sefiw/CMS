using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{



    public record GetLetterCountPerStatusQuery() : IRequest<LetterCountsByStatus>;
    public record LetterCountsByStatus(int pending, int received, int responded, int archived);

    public class GetBusinessUnitCountPerApprovalStatusQueryHandler : IRequestHandler<GetLetterCountPerStatusQuery, LetterCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetBusinessUnitCountPerApprovalStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<LetterCountsByStatus> Handle(GetLetterCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var pending = await dataService.Letters.Where(bu => bu.Status == LetterStatus.pending).CountAsync();
            var received = await dataService.Letters.Where(bu => bu.Status == LetterStatus.received).CountAsync();
            var responded = await dataService.Letters.Where(bu => bu.Status == LetterStatus.responded).CountAsync();
            var archived = await dataService.Letters.Where(bu => bu.Status == LetterStatus.archived).CountAsync();

            return new(pending, received, responded, archived);
        }
    }
}
