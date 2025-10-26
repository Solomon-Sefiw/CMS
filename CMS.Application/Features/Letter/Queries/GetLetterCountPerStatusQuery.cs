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


    public record GetLetterCountPerStatusQuery(string UserId) : IRequest<LetterCountsByStatus>;
    public record LetterCountsByStatus(int pending, int received, int responded, int archived);

    public class GetLetterCountPerStatusQueryHandler : IRequestHandler<GetLetterCountPerStatusQuery, LetterCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetLetterCountPerStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<LetterCountsByStatus> Handle(GetLetterCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;

            // A user is considered involved if: sender == user OR exists in recipients OR exists in CC user
            var pending = await dataService.Letters
                .Where(l => l.Status == LetterStatus.pending &&
                    (l.SenderId == userId ||
                     dataService.LetterRecipients.Any(r => r.LetterId == l.Id && r.RecipientId == userId) ||
                     dataService.LetterCCs.Any(c => c.LetterId == l.Id && c.CCUserId == userId)
                    ))
                .CountAsync(cancellationToken);

            var received = await dataService.Letters
                .Where(l => l.Status == LetterStatus.received &&
                    (l.SenderId == userId ||
                     dataService.LetterRecipients.Any(r => r.LetterId == l.Id && r.RecipientId == userId) ||
                     dataService.LetterCCs.Any(c => c.LetterId == l.Id && c.CCUserId == userId)
                    ))
                .CountAsync(cancellationToken);

            var responded = await dataService.Letters
                .Where(l => l.Status == LetterStatus.responded &&
                    (l.SenderId == userId ||
                     dataService.LetterRecipients.Any(r => r.LetterId == l.Id && r.RecipientId == userId) ||
                     dataService.LetterCCs.Any(c => c.LetterId == l.Id && c.CCUserId == userId)
                    ))
                .CountAsync(cancellationToken);

            var archived = await dataService.Letters
                .Where(l => l.Status == LetterStatus.archived &&
                    (l.SenderId == userId ||
                     dataService.LetterRecipients.Any(r => r.LetterId == l.Id && r.RecipientId == userId) ||
                     dataService.LetterCCs.Any(c => c.LetterId == l.Id && c.CCUserId == userId)
                    ))
                .CountAsync(cancellationToken);

            return new LetterCountsByStatus(pending, received, responded, archived);
        }
    }
}
