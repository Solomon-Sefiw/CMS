using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.Delegation.Commands.CreateDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.ApproveDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.RejectDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.SubmitDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.UpdateDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelegationController : BaseController<DelegationController>
    {
        [HttpPost("Create", Name = "CreateDelegation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateDelegation([FromBody] CreateDelegationCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpGet("GetAll", Name = "GetAllDelegation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DelegationLists>> GetAllDelegation()
        {
            return Ok(await mediator.Send(new GetAllDelegationsQuery()));
        }

        [HttpGet("GetPaginatedDelegations", Name = "GetPaginatedDelegations")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedDelegationlist>> GetPaginatedDelegations(int Id, ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedDelegationsQuery(Id, status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetDelegationCountPerStatus")]
        [ProducesResponseType(200)]
        public async Task<DelegationCountsByStatus> GetDelegationCountPerStatus(int Id)
        {
            return await mediator.Send(new GetDelegationCountPerStatusQuery(Id));
        }


        [HttpPut("Update", Name = "UpdateDelegation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateDelegation(UpdateDelegationCommands command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitDelegation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitDelegation([FromBody] SubmitDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("approve", Name = "ApproveDelegation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveDelegation([FromBody] ApproveDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("Reject", Name = "RejectDelegation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectDelegation([FromBody] RejectDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
    }
}
