using AutoMapper;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Queries
{
    public record GetPaginatedLettersQuery(LetterStatus Status, string UserId, int PageNumber = 1, int PageSize = 10)
        : IRequest<PaginatedLetterList>;

    public record PaginatedLetterList(List<LetterDto> Items, int TotalCount);

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
            var userId = request.UserId;

            var query = _dataService.Letters
                .Include(l => l.Sender)
                .Include(l => l.BusinessUnits)
                .Include(l => l.LetterDocument)
                .Include(l => l.Recipients)
                    .ThenInclude(r => r.Recipient)
                .Include(l => l.CCRecipients)
                    .ThenInclude(c => c.CCUser)
                .Include(l => l.CCRecipients)
                    .ThenInclude(c => c.CCDepartment)
                .AsQueryable();

            // filter by status
            query = query.Where(l => l.Status == request.Status);

            // filter letters involving the current user (sender, recipient, or CC)
            query = query.Where(l =>
                l.SenderId == userId ||
                l.Recipients.Any(r => r.RecipientId == userId) ||
                l.CCRecipients.Any(c => c.CCUserId == userId)
            );

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(l => l.SentDate ?? l.ReceivedDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs
            var dtos = items.Select(l =>
            {
                var dto = _mapper.Map<LetterDto>(l);

                dto.Recipients = l.Recipients?.ToList() ?? new();
                dto.CCUsers = l.CCRecipients?.Where(c => c.CCUserId != null).ToList() ?? new();
                dto.CCDepartments = l.CCRecipients?.Where(c => c.CCDepartmentId != null).ToList() ?? new();

                dto.RecipientIds = dto.Recipients.Select(r => r.RecipientId).ToList();
                dto.CCUserIds = dto.CCUsers.Select(c => c.CCUserId!).ToList();
                dto.CCDepartmentIds = dto.CCDepartments.Select(c => c.CCDepartmentId!.Value).ToList();

                return dto;
            }).ToList();

            return new PaginatedLetterList(dtos, total);
        }
    }
}
