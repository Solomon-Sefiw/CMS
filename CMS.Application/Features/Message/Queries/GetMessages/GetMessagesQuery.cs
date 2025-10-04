
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetMessagesQuery(string UserId, string ChatPartnerId) : IRequest<List<ChatMessageDto>>;

public class GetMessagesQueryHandler : IRequestHandler<GetMessagesQuery, List<ChatMessageDto>>
{
    private readonly IDataService _context;

    public GetMessagesQueryHandler(IDataService context)
    {
        _context = context;
    }

    public async Task<List<ChatMessageDto>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
    {
        var messages = await _context.Messages
            .Where(m =>
                (m.SenderId == request.UserId && m.ReceiverId == request.ChatPartnerId) ||
                (m.SenderId == request.ChatPartnerId && m.ReceiverId == request.UserId))
            .OrderBy(m => m.SentAt)
            .Select(m => new ChatMessageDto(m.Id, m.SenderId, m.ReceiverId, m.Content, m.SentAt, m.IsRead))
            .ToListAsync(cancellationToken);

        return messages;
    }
}

//using HCMS.Services.DataService;
//using MediatR;
//using Microsoft.EntityFrameworkCore;

//public record GetMessagesQuery(int JobId, string UserId, string ReceiverId) : IRequest<List<MessageDto>>;

//public class GetMessagesQueryHandler : IRequestHandler<GetMessagesQuery, List<MessageDto>>
//{
//    private readonly IDataService _context;

//    public GetMessagesQueryHandler(IDataService context)
//    {
//        _context = context;
//    }

//    public async Task<List<MessageDto>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
//    {
//        // Fetch messages strictly between the sender and receiver
//        return await _context.Messages
//            .Where(m => m.JobId == request.JobId &&
//                        ((m.SenderId == request.UserId && m.ReceiverId == request.ReceiverId) ||
//                         (m.SenderId == request.ReceiverId && m.ReceiverId == request.UserId))) // One-to-one condition
//            .OrderBy(m => m.SentAt)
//            .Select(m => new MessageDto(m.Id, m.JobId, m.SenderId, m.ReceiverId, m.Content, m.SentAt, m.IsRead))
//            .ToListAsync(cancellationToken);
//    }
//}


