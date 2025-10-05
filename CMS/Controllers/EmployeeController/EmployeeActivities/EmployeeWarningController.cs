using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.ApproveEmployeeWarning;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.CreateEmployeeWarning;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.RejectEmployeeWarning;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.SubmitEmployeeWarning;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.UpdateEmployeeWarning;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeWarningController : BaseController<EmployeeWarningController>
    {
        [HttpPost("Create", Name = "CreateEmployeeWarning")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateEmployeeWarning([FromBody] CreateEmployeeWarningCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetPaginatedEmployeeWarnings", Name = "GetPaginatedEmployeeWarnings")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedEmployeeWarninglist>> GetPaginatedEmployeeWarnings(int Id, ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedEmployeeWarningsQuery(Id, status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetEmployeeWarningCountPerStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<EmployeeWarningCountsByStatus> GetEmployeeWarningCountPerStatus(int Id)
        {
            return await mediator.Send(new GetEmployeeWarningCountPerStatusQuery(Id));
        }


        [HttpPut("Update", Name = "UpdateEmployeeWarning")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateEmployeeWarning(UpdateEmployeeWarningCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitEmployeeWarning")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitEmployeeWarning([FromBody] SubmitEmployeeWarningCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("approve", Name = "ApproveEmployeeWarning")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveEmployeeWarning([FromBody] ApproveEmployeeWarningCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("Reject", Name = "RejectEmployeeWarning")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectEmployeeWarning([FromBody] RejectEmployeeWarningCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
    }
}

