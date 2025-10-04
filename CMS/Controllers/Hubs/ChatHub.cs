using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    public async Task SendMessage(string senderId, string receiverId, string content)
    {
        await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, content);
    }

    public async Task NotifyRead(string userId, string chatPartnerId)
    {
        await Clients.User(chatPartnerId).SendAsync("MessagesRead", userId);
    }
}


