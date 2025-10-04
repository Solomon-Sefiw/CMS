
using CMS.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DZJobs.Controllers.Message
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : BaseController<MessageController>
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        [HttpGet("conversations", Name = "GetUserConversations")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<ConversationDto>>> GetUserConversations(string userId)
        {
            //var userId = User.FindFirst("sub")?.Value!;
            var conversations = await mediator.Send(new GetUserConversationsQuery(userId));
            return Ok(conversations);
        }


        [HttpGet("messages/{chatPartnerId}", Name = "GetMessages")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<ChatMessageDto>>> GetMessages(string userId,string chatPartnerId)
        {
           // var userId = User.FindFirst("sub")?.Value!;
            var messages = await mediator.Send(new GetMessagesQuery(userId, chatPartnerId));
            return Ok(messages);
        }


        [HttpPost("send", Name = "SendMessage")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> SendMessage(SendMessageCommand command)
        {
            var message = await mediator.Send(command);
            await _hubContext.Clients.User(command.ReceiverId).SendAsync("ReceiveMessage", message);
            return Ok(message);
        }


        [HttpPost("mark-read/{chatPartnerId}", Name = "MarkMessagesAsRead")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> MarkMessagesAsRead(string userId,string chatPartnerId)
        {
           // var userId = User.FindFirst("sub")?.Value!;
            await mediator.Send(new MarkMessagesAsReadCommand(userId, chatPartnerId));
            await _hubContext.Clients.User(chatPartnerId).SendAsync("MessagesRead", userId);
            return Ok();
        }

    }
}
