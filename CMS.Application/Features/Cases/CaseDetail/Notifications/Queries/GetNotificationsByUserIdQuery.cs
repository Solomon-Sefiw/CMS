using CMS.Application.Features.Cases.CaseDetail.Notifications.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Notifications.Queries
{
    public record GetNotificationsByUserIdQuery(string UserId) : IRequest<List<NotificationDto>>;

    public class GetNotificationsByUserIdQueryHandler : IRequestHandler<GetNotificationsByUserIdQuery, List<NotificationDto>>
    {
        private readonly IDataService _context;

        public GetNotificationsByUserIdQueryHandler(IDataService context)
        {
            _context = context;
        }

        public async Task<List<NotificationDto>> Handle(GetNotificationsByUserIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Notifications
                .Where(n => n.UserId == request.UserId)
                .OrderByDescending(n => n.SentAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Body = n.Body,
                    IsRead = n.IsRead,
                    SentAt = n.SentAt,
                    Channel = n.Channel
                })
                .ToListAsync(cancellationToken);
        }
    }
}
