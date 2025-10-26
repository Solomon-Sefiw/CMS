
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public record LetterLists(List<LetterDto> archived, List<LetterDto> responded, List<LetterDto> received, List<LetterDto> pending);
    public record GetLettersQuery : IRequest<LetterLists>;

    public class GetLettersQueryHandler : IRequestHandler<GetLettersQuery, LetterLists>
    {
        private readonly IDataService _dataService;

        public GetLettersQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<LetterLists> Handle(GetLettersQuery request, CancellationToken cancellationToken)
        {
            var letters = await _dataService.Letters
                .Include(l => l.Sender)
                .Include(l => l.BusinessUnits)
                .Include(l => l.LetterDocument)
                .ToListAsync(cancellationToken);

            var dtos = letters.Select(l => new LetterDto
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
                RecipientIds = _dataService.LetterRecipients.Where(r => r.LetterId == l.Id).Select(r => r.RecipientId).ToList(),
                CCUserIds = _dataService.LetterCCs.Where(c => c.LetterId == l.Id && c.CCUserId != null).Select(c => c.CCUserId).ToList(),
                CCDepartmentIds = _dataService.LetterCCs.Where(c => c.LetterId == l.Id && c.CCDepartmentId != null).Select(c => c.CCDepartmentId!.Value).ToList()
            }).ToList();

            var grouped = dtos.GroupBy(d => d.Status).ToDictionary(g => g.Key, g => g.ToList());

            return new LetterLists(
                archived: grouped.GetValueOrDefault(LetterStatus.archived, new List<LetterDto>()),
                responded: grouped.GetValueOrDefault(LetterStatus.responded, new List<LetterDto>()),
                received: grouped.GetValueOrDefault(LetterStatus.received, new List<LetterDto>()),
                pending: grouped.GetValueOrDefault(LetterStatus.pending, new List<LetterDto>())
            );
        }
    }
}