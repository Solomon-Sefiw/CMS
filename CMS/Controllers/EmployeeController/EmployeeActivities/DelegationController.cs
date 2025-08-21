using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.Delegation.Commands.CreateDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.ApproveDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.RejectDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.RemoveDeligation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.SubmitDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.UpdateDelegation;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelegationController : BaseController<DelegationController>
    {
        [HttpPost("Create", Name = "CreateDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateDelegation([FromBody] CreateDelegationCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpGet("GetAllActive", Name = "GetAllActiveDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DelegationDto>> GetAllActiveDelegation(int Id)
        {
            return Ok(await mediator.Send(new GetAllActiveDelegationsQuery(Id)));
        }
        [HttpGet("GetAll", Name = "GetAllDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DelegationLists>> GetAllDelegation()
        {
            return Ok(await mediator.Send(new GetAllDelegationsQuery()));
        }

        [HttpGet("GetPaginatedDelegations", Name = "GetPaginatedDelegations")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedDelegationlist>> GetPaginatedDelegations(int Id, ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedDelegationsQuery(Id, status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetDelegationCountPerStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<DelegationCountsByStatus> GetDelegationCountPerStatus(int Id)
        {
            return await mediator.Send(new GetDelegationCountPerStatusQuery(Id));
        }


        [HttpPut("Update", Name = "UpdateDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateDelegation(UpdateDelegationCommands command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitDelegation([FromBody] SubmitDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("approve", Name = "ApproveDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveDelegation([FromBody] ApproveDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("Reject", Name = "RejectDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectDelegation([FromBody] RejectDelegationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
        [HttpPatch("Remove", Name = "RemoveDelegation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RemoveDelegation([FromBody] RemoveDeligationCommand command)
        {
            var delegationId = await mediator.Send(command);
            return Ok(delegationId);
        }
    }
}
