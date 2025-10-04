using CMS.Services.DataService;
using MediatR;
using System;

public record SendMessageCommand(string SenderId, string ReceiverId, string Content) : IRequest<ChatMessageDto>;

public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, ChatMessageDto>
{
    private readonly IDataService _context;

    public SendMessageCommandHandler(IDataService context)
    {
        _context = context;
    }

    public async Task<ChatMessageDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var message = new Message
        {
            SenderId = request.SenderId,
            ReceiverId = request.ReceiverId,
            Content = request.Content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveAsync(cancellationToken);

        return new ChatMessageDto(message.Id, message.SenderId, message.ReceiverId, message.Content, message.SentAt, message.IsRead);
    }
}

//using HCMS.Services.DataService;
//using MediatR;

//public record SendMessageCommand(int JobId, string SenderId, string ReceiverId, string Content) : IRequest<int>;

//public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, int>
//{
//    private readonly IDataService _context;

//    public SendMessageCommandHandler(IDataService context)
//    {
//        _context = context;
//    }

//    public async Task<int> Handle(SendMessageCommand request, CancellationToken cancellationToken)
//    {
//        var message = new Message
//        {
//            JobId = request.JobId,
//            SenderId = request.SenderId,
//            ReceiverId = request.ReceiverId,
//            Content = request.Content
//        };

//        _context.Messages.Add(message);
//        await _context.SaveAsync(cancellationToken);

//        return message.Id;
//    }
//}
