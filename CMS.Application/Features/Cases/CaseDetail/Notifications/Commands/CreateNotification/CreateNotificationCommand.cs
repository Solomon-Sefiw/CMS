using CMS.Domain.Enum;
using CMS.Domain.Notifications;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Notifications.Commands.CreateNotification
{
    public record CreateNotificationCommand(
           string UserId,
           string Title,
           string? Body,
           int? CaseId,
           int? PaymentId,
           int? HearingId,
           NotificationChannel Channel
       ) : IRequest<int>;


    public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, int>
    {
        private readonly IDataService _context;

        public CreateNotificationCommandHandler(IDataService context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = new Notification
            {
                UserId = request.UserId,
                Title = request.Title,
                Body = request.Body,
                CaseId = request.CaseId,
                PaymentId = request.PaymentId,
                HearingId = request.HearingId,
                Channel = request.Channel,
                IsRead = false,
                SentAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveAsync(cancellationToken);

            return notification.Id;
        }
    }



}
