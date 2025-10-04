public record ConversationDto(
    string ChatPartnerId,
    string ChatPartnerName,
    string LastMessage,
    DateTime LastMessageTime,
    int UnreadCount);
