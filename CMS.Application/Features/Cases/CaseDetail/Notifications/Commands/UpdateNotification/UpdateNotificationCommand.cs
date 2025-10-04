using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Notifications.Commands.UpdateNotification
{
    public record UpdateNotificationCommand(
          int Id,
          bool IsRead
      ) : IRequest<int>;


    public class UpdateNotificationCommandHandler : IRequestHandler<UpdateNotificationCommand, int>
    {
        private readonly IDataService _context;

        public UpdateNotificationCommandHandler(IDataService context)
        {
            _context = context;
        }

        public async Task<int> Handle(UpdateNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == request.Id, cancellationToken);

            if (notification == null) throw new KeyNotFoundException("Notification not found");

            notification.IsRead = request.IsRead;
            await _context.SaveAsync(cancellationToken);

            return notification.Id;
        }
    }
}
