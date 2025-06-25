using CMS.Application.Features.Letter.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public record LetterLists(
        List<LetterDto> archived,
        List<LetterDto> responded,
        List<LetterDto> received,
        List<LetterDto> pending
    );

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
            // Fetch all letters from the data service
            var letters = await _dataService.Letters.ToListAsync(cancellationToken);

            // Map to LetterDto and categorize by ApprovalStatus
            var categorizedLetters = letters.Select(l => new LetterDto
            {
                Id = l.Id,
                ReferenceNumber = l.ReferenceNumber,
                Subject = l.Subject,
                Content = l.Content,
                LetterType = l.LetterType,
                Status = l.Status, // Assuming 'Status' property in the Letter entity maps to ApprovalStatus or can be cast. If not, you need a specific ApprovalStatus property on your Letter entity.
                ReceivedDate = l.ReceivedDate,
                SentDate = l.SentDate,
                SenderId = l.SenderId,
                Sender = l.Sender,
                RecipientId = l.RecipientId,
                Recipient = l.Recipient,
                BusinessUnitId = l.BusinessUnitId,
                BusinessUnits = l.BusinessUnits // Assuming this is a collection of related business units
            })
            // IMPORTANT CHANGE: Group by the 'Status' property (which should represent the ApprovalStatus)
            .GroupBy(l => l.Status)
            .ToDictionary(g => g.Key, g => g.ToList());

            // Construct and return the categorized lists
            return new LetterLists(
                pending: categorizedLetters.GetValueOrDefault(LetterStatus.pending, new List<LetterDto>()),
                received: categorizedLetters.GetValueOrDefault(LetterStatus.received, new List<LetterDto>()),
                responded: categorizedLetters.GetValueOrDefault(LetterStatus.responded, new List<LetterDto>()),
                archived: categorizedLetters.GetValueOrDefault(LetterStatus.archived, new List<LetterDto>())
            );
        }
    }
}