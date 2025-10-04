using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Notifications.Commands.CreateNotification;
using CMS.Application.Features.Cases.CaseDetail.Notifications.Commands.UpdateNotification;
using CMS.Application.Features.Cases.CaseDetail.Notifications.Models;
using CMS.Application.Features.Cases.CaseDetail.Notifications.Queries;

using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Notification
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : BaseController<NotificationController>
    {
        [HttpPost("Create", Name = "CreateNotification")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreateNotification([FromBody] CreateNotificationCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update/{id}", Name = "UpdateNotification")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> UpdateNotification(int id, [FromBody] UpdateNotificationCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetByUserId/{userId}", Name = "GetNotificationsByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<NotificationDto>>> GetNotificationsByUserId(string userId)
        {
            return await mediator.Send(new GetNotificationsByUserIdQuery(userId));
        }
    }
}
