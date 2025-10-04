using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.ReAssignmentActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.RejectActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.SubmitActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.UpdateActing;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActingController : BaseController<ActingController>
    {
        [HttpPost("Create", Name = "CreateActing")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateActing([FromBody] CreateActingCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPost("Reassign", Name = "CreateReassignment")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateReassignment([FromBody] ReAssignmentActingCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpGet("GetAllActive", Name = "GetAllActiveActing")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ActingDto>> GetAllActiveActing(int Id)
        {
            return Ok(await mediator.Send(new GetAllActiveActingsQuery(Id)));
        }
        [HttpGet("GetPaginatedActings", Name = "GetPaginatedActings")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedActinglist>> GetPaginatedActings(int Id, ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedActingsQuery(Id, status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetActingCountPerStatus")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActingCountsByStatus> GetActingCountPerStatus(int Id)
        {
            return await mediator.Send(new GetActingCountPerStatusQuery(Id));
        }


        [HttpPut("Update", Name = "UpdateActing")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateActing(UpdateActingCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitActing")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitActing([FromBody] SubmitActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
        [HttpPatch("approve", Name = "ApproveActing")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveActing([FromBody] ApproveActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
        [HttpPatch("Reject", Name = "RejectActing")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectActing([FromBody] RejectActingCommand command)
        {
            var actingId = await mediator.Send(command);
            return Ok(actingId);
        }
    }
}

