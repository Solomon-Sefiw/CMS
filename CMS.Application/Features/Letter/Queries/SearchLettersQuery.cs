using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Letter.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public record SearchLettersQuery(string userId) : IRequest<List<LetterDto>>;

    public class SearchLettersQueryHandler : IRequestHandler<SearchLettersQuery, List<LetterDto>>
    {
        private readonly IDataService _dataService;

        public SearchLettersQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<LetterDto>> Handle(SearchLettersQuery request, CancellationToken cancellationToken)
        {
            var letters = await _dataService.Letters
                .Include(l => l.Sender)
                .Include(l => l.Recipient)
                .Include(l => l.BusinessUnits)
                .Where(l =>  l.SenderId == request.userId || l.RecipientId == request.userId)
                .ToListAsync(cancellationToken);

            return letters.Select(l => new LetterDto
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
                RecipientId = l.RecipientId,
                Recipient = l.Recipient,
                BusinessUnitId = l.BusinessUnitId,
                BusinessUnits = l.BusinessUnits
            }).ToList();
        }
    }
}
