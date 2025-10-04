public record ChatMessageDto(int Id, string SenderId, string ReceiverId, string Content, DateTime SentAt, bool IsRead);
