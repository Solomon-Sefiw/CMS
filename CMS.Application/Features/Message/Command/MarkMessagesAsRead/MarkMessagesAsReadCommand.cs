
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record MarkMessagesAsReadCommand(string UserId, string ChatPartnerId) : IRequest<bool>;

public class MarkMessagesAsReadCommandHandler : IRequestHandler<MarkMessagesAsReadCommand, bool>
{
    private readonly IDataService _context;

    public MarkMessagesAsReadCommandHandler(IDataService context)
    {
        _context = context;
    }

    public async Task<bool> Handle(MarkMessagesAsReadCommand request, CancellationToken cancellationToken)
    {
        var unreadMessages = await _context.Messages
            .Where(m => m.SenderId == request.ChatPartnerId && m.ReceiverId == request.UserId && !m.IsRead)
            .ToListAsync(cancellationToken);

        if (!unreadMessages.Any()) return false;

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }

        await _context.SaveAsync(cancellationToken);
        return true;
    }
}
