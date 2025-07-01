using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Letter.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public record GetPaginatedLettersQuery(
        LetterStatus Status,
        string UserId,
        int PageNumber = 1,
        int PageSize = 10
        
    ) : IRequest<PaginatedLetterList>;

    public record PaginatedLetterList(
        List<LetterDto> Items,
        int TotalCount
    );

    public class GetPaginatedLettersQueryHandler : IRequestHandler<GetPaginatedLettersQuery, PaginatedLetterList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedLettersQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedLetterList> Handle(GetPaginatedLettersQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Letters
                .Include(l => l.Sender)
                .Include(l => l.Recipient)
                .Include(l => l.BusinessUnits)
                .Include(l => l.LetterDocuments)
                .AsQueryable();

            // Fix: Removed HasValue check since LetterStatus is an enum and cannot be null
            query = query.Where(l => l.Status == request.Status && (l.SenderId == request.UserId || l.RecipientId == request.UserId));

            var totalCount = await query.CountAsync(cancellationToken);

            var lettersPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var letterDtos = _mapper.Map<List<LetterDto>>(lettersPaginated);

            return new PaginatedLetterList(letterDtos, totalCount);
        }
    }
}