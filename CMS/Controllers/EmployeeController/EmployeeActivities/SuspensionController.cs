using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Queries;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.ApproveSuspension;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.CreateSuspension;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.RejectSuspension;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.SubmitSuspension;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.UpdateSuspension;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuspensionController : BaseController<SuspensionController>
    {
        [HttpPost("Create")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> CreateSuspension([FromBody] CreateSuspensionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPut("Update")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateSuspension(UpdateSuspensionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Submit")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmitSuspension([FromBody] SubmitSuspensionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Approve")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveSuspension([FromBody] ApproveSuspensionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Reject")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectSuspension([FromBody] RejectSuspensionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetPaginatedSuspensions")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<PaginatedSuspensionList>> GetPaginatedSuspensions(int employeeId, ApprovalStatus? status, int pageNumber, int pageSize)
        {
            return await mediator.Send(new GetPaginatedSuspensionsQuery(employeeId, status, pageNumber, pageSize));
        }

        [HttpGet("Count")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<SuspensionCountsByStatus> GetSuspensionCountPerStatus(int employeeId)
        {
            return await mediator.Send(new GetSuspensionCountPerStatusQuery(employeeId));
        }
        [HttpGet("GetActive", Name = "GetActiveSuspention")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ActingDto>> GetActiveSuspention(int Id)
        {
            return Ok(await mediator.Send(new GetAllActiveSuspentionsQuery(Id)));
        }
    }
}
