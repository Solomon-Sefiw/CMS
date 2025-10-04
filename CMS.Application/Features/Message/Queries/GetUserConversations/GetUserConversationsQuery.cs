using CMS.Domain.User;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public record GetUserConversationsQuery(string UserId) : IRequest<List<ConversationDto>>;

public class GetUserConversationsQueryHandler : IRequestHandler<GetUserConversationsQuery, List<ConversationDto>>
{
    private readonly IDataService _context;
    private readonly UserManager<HRUser> _userManager;

    public GetUserConversationsQueryHandler(IDataService context, UserManager<HRUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<List<ConversationDto>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;

        // ✅ Get all users except the current one from ASP.NET Identity
        var allUsers = await _userManager.Users
            .Where(u => u.Id != userId)
            .ToListAsync(cancellationToken);

        // ✅ Get all messages for current user
        var messages = await _context.Messages
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .ToListAsync(cancellationToken);

        var conversations = allUsers.Select(user =>
        {
            var userMessages = messages
                .Where(m => (m.SenderId == user.Id && m.ReceiverId == userId) ||
                            (m.ReceiverId == user.Id && m.SenderId == userId))
                .ToList();

            var latestMessage = userMessages
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefault();

            var unreadCount = userMessages.Count(m =>
                m.SenderId == user.Id && m.ReceiverId == userId && !m.IsRead);

            return new ConversationDto(
                user.Id,
                user.UserName,
                latestMessage?.Content ?? "",                 // If no chat, empty message
                latestMessage?.SentAt ?? DateTime.MinValue,   // If no chat, default time
                unreadCount
            );
        })
        // put conversations with messages at top, others at bottom
        .OrderByDescending(c => c.LastMessageTime > DateTime.MinValue)
        .ThenByDescending(c => c.LastMessageTime)
        .ToList();

        return conversations;
    }
}



//using CMS.Services.DataService;
//using MediatR;
//using Microsoft.EntityFrameworkCore;

//public record GetUserConversationsQuery(string UserId) : IRequest<List<ConversationDto>>;

//public class GetUserConversationsQueryHandler : IRequestHandler<GetUserConversationsQuery, List<ConversationDto>>
//{
//    private readonly IDataService _context;

//    public GetUserConversationsQueryHandler(IDataService context)
//    {
//        _context = context;
//    }

//    public async Task<List<ConversationDto>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken)
//    {
//        var userId = request.UserId;

//        var messages = await _context.Messages
//            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
//            .Include(m => m.Sender)
//            .Include(m => m.Receiver)
//            .ToListAsync(cancellationToken);

//        var conversations = messages
//            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
//            .Select(g =>
//            {
//                var latestMessage = g.OrderByDescending(m => m.SentAt).FirstOrDefault();
//                if (latestMessage == null) return null;

//                var chatPartnerId = latestMessage.SenderId == userId ? latestMessage.ReceiverId : latestMessage.SenderId;
//                var chatPartnerName = latestMessage.SenderId == userId ? latestMessage.Receiver.UserName : latestMessage.Sender.UserName;

//                var unreadCount = g.Count(m => m.SenderId == chatPartnerId && m.ReceiverId == userId && !m.IsRead);

//                return new ConversationDto(chatPartnerId, chatPartnerName, latestMessage.Content, latestMessage.SentAt, unreadCount);
//            })
//            .Where(c => c != null)
//            .OrderByDescending(c => c!.LastMessageTime)
//            .ToList()!;

//        return conversations;
//    }
//}
