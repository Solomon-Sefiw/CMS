using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.ApproveActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.RejectActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.SubmitActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.UpdateActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.UpdateDelegation;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActingController : BaseController<ActingController>
    {
        [HttpPost("Create", Name = "CreateActing")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateActing([FromBody] CreateActingCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        //[HttpGet("GetAll", Name = "GetAllDelegation")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //public async Task<ActionResult<DelegationLists>> GetAllDelegation()
        //{
        //    return Ok(await mediator.Send(new GetAllDelegationsQuery()));
        //}

        [HttpGet("GetPaginatedActings", Name = "GetPaginatedActings")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedActinglist>> GetPaginatedActings(int Id, ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedActingsQuery(Id, status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetActingCountPerStatus")]
        [ProducesResponseType(200)]
        public async Task<ActingCountsByStatus> GetActingCountPerStatus(int Id)
        {
            return await mediator.Send(new GetActingCountPerStatusQuery(Id));
        }


        [HttpPut("Update", Name = "UpdateActing")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateActing(UpdateActingCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitActing")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitActing([FromBody] SubmitActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
        [HttpPatch("approve", Name = "ApproveActing")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveActing([FromBody] ApproveActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
        [HttpPatch("Reject", Name = "RejectActing")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectActing([FromBody] RejectActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
    }
}

