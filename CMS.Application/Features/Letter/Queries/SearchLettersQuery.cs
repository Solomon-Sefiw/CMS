
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public class SearchLettersQuery : IRequest<List<LetterDto>>
    {
        public string UserId { get; }
        public SearchLettersQuery(string userId) { UserId = userId; }
    }

    public class SearchLettersQueryHandler : IRequestHandler<SearchLettersQuery, List<LetterDto>>
    {
        private readonly IDataService dataService;

        public SearchLettersQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<List<LetterDto>> Handle(SearchLettersQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;

            var letters = await dataService.Letters
                .Include(l => l.Sender)
                .Include(l => l.BusinessUnits)
                .Include(l => l.LetterDocument)
                .Where(l =>
                    l.SenderId == userId ||
                    dataService.LetterRecipients.Any(r => r.LetterId == l.Id && r.RecipientId == userId) ||
                    dataService.LetterCCs.Any(c => c.LetterId == l.Id && c.CCUserId == userId)
                )
                .ToListAsync(cancellationToken);

            var result = letters.Select(l =>
            {
                return new LetterDto
                {
                    Id = l.Id,
                    ReferenceNumber = l.ReferenceNumber,
                    Subject = l.Subject,
                    Content = l.Content,
                    LetterType = l.LetterType,
                    Status = l.Status,
                    ReceivedDate = l.ReceivedDate,
                    SentDate = l.SentDate,
                    SenderId = l.SenderId,
                    Sender = l.Sender,
                    BusinessUnitId = l.BusinessUnitId,
                    BusinessUnits = l.BusinessUnits,
                    LetterDocument = l.LetterDocument,
                    RecipientIds = dataService.LetterRecipients.Where(r => r.LetterId == l.Id).Select(r => r.RecipientId).ToList(),
                    CCUserIds = dataService.LetterCCs.Where(c => c.LetterId == l.Id && c.CCUserId != null).Select(c => c.CCUserId).ToList(),
                    CCDepartmentIds = dataService.LetterCCs.Where(c => c.LetterId == l.Id && c.CCDepartmentId != null).Select(c => c.CCDepartmentId!.Value).ToList()
                };
            }).ToList();

            return result;
        }
    }
}