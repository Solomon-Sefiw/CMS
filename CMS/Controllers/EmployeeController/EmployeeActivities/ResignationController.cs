using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.ApproveResignation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.CreateResignation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.RejectResignation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.SubmitResignation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.UpdateResignation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeController.EmployeeActivities
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResignationController : BaseController<ResignationController>
    {
        [HttpPost("Create")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> CreateResignation([FromBody] CreateResignationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPut("Update")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateResignation(UpdateResignationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Submit")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmitResignation([FromBody] SubmitResignationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Approve")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveResignation([FromBody] ApproveResignationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPatch("Reject")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectResignation([FromBody] RejectResignationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetPaginatedResignations")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<PaginatedResignationList>> GetPaginatedResignations(int employeeId, ApprovalStatus? status, int pageNumber, int pageSize)
        {
            return await mediator.Send(new GetPaginatedResignationsQuery(employeeId, status, pageNumber, pageSize));
        }

        [HttpGet("Count")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ResignationCountsByStatus> GetResignationCountPerStatus(int employeeId)
        {
            return await mediator.Send(new GetResignationCountPerStatusQuery(employeeId));
        }
        [HttpGet("GetAllActive", Name = "GetActiveResignation")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ActingDto>> GetActiveResignation(int Id)
        {
            return Ok(await mediator.Send(new GetAllActiveResignationsQuery(Id)));
        }
    }
}
