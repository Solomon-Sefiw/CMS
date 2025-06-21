using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Application.Features.Letter.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{

    public class PaginatedList<T> : List<T>
    {
        public int PageNumber { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalCount { get; private set; }
        public int PageSize { get; private set; }

        public PaginatedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            TotalCount = count;
            PageSize = pageSize;
            AddRange(items);
        }

        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PaginatedList<T>(items, count, pageNumber, pageSize);
        }
    }

    public record GetLetterListForPaginationQuery(
        LetterStatus Status, // Required parameter moved to the beginning
        int PageNumber = 1,
        int PageSize = 10,
        string? SearchTerm = null,
        string? SortBy = null,
        bool SortAscending = true
    ) : IRequest<PaginatedList<LetterDto>>;


    public class GetLetterListForPaginationQueryHandler : IRequestHandler<GetLetterListForPaginationQuery, PaginatedList<LetterDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetLetterListForPaginationQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedList<LetterDto>> Handle(GetLetterListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Letters
                .Include(l => l.BusinessUnits)
                .Include(l => l.Sender)
                .Include(l => l.Recipient)
                .Where(l => l.Status == request.Status) // Filter by LetterStatus
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTermLower = request.SearchTerm.ToLower();
                query = query.Where(l =>
                    l.Subject.ToLower().Contains(searchTermLower) ||
                    l.ReferenceNumber.ToLower().Contains(searchTermLower) ||
                    l.Content.ToLower().Contains(searchTermLower) ||
                    (l.Sender != null && l.Sender.UserName.ToLower().Contains(searchTermLower)) ||
                    (l.Recipient != null && l.Recipient.UserName.ToLower().Contains(searchTermLower))
                );
            }

            if (!string.IsNullOrWhiteSpace(request.SortBy))
            {
                switch (request.SortBy.ToLower())
                {
                    case "referencenumber":
                        query = request.SortAscending ? query.OrderBy(l => l.ReferenceNumber) : query.OrderByDescending(l => l.ReferenceNumber);
                        break;
                    case "subject":
                        query = request.SortAscending ? query.OrderBy(l => l.Subject) : query.OrderByDescending(l => l.Subject);
                        break;
                    case "receiveddate":
                        query = request.SortAscending ? query.OrderBy(l => l.ReceivedDate) : query.OrderByDescending(l => l.ReceivedDate);
                        break;
                    case "status":
                        query = request.SortAscending ? query.OrderBy(l => l.Status) : query.OrderByDescending(l => l.Status);
                        break;
                    default:
                        query = query.OrderByDescending(l => l.ReceivedDate);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(l => l.ReceivedDate);
            }

            var projectedQuery = query.ProjectTo<LetterDto>(_mapper.ConfigurationProvider);

            return await PaginatedList<LetterDto>.CreateAsync(
                projectedQuery.AsNoTracking(),
                request.PageNumber,
                request.PageSize
            );
        }
    }

}
