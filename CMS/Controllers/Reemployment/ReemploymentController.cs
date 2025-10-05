using CMS.API.Controllers;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Application.Features.Reemployments.Model;
using CMS.Application.Features.Reemployments.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Reemployment
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReemploymentController : BaseController<ReemploymentController>
    {
        [HttpPost("CreateReemployment", Name = "CreateReemployment")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> CreateReemployment([FromBody] CreateReemploymentCommand command)
        {
            var newReemploymentRequest = await mediator.Send(command);
            return Ok(newReemploymentRequest);
        }

        [HttpPost("UpdateReemployment", Name = "UpdateReemployment")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateReemployment([FromBody] UpdateReemploymentCommand command)
        {
            var editedReemploymentRequest = await mediator.Send(command);
            return Ok(editedReemploymentRequest);
        }

        [HttpPost("SubmitReemployment", Name = "SubmitReemployment")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitReemployment([FromBody] SubmitReemploymentCommand command)
        {
            var submittedReemploymentRequest = await mediator.Send(command);
            return Ok(submittedReemploymentRequest);
        }

        [HttpPost("RejectReemployment", Name = "RejectReemployment")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectReemployment([FromBody] RejectReemploymentCommand command)
        {
            var rejectedReemploymentRequest = await mediator.Send(command);
            return Ok(rejectedReemploymentRequest);
        }

        [HttpPost("ApproveReemployment", Name = "ApproveReemployment")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveReemployment([FromBody] ApproveReemploymentCommand command)
        {
            var approvedReemploymentRequest = await mediator.Send(command);
            return Ok(approvedReemploymentRequest);
        }

        [HttpGet("GetAllReemploymentsList", Name = "GetAllReemploymentsList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<ReemploymentDto>>> GetAllReemploymentsList()
        {
            var result = await mediator.Send(new GetAllReemploymentsQuery());
            return Ok(result);
        }

        [HttpGet("GetReemploymentCountPerStatus", Name = "GetReemploymentCountPerStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ReemploymentCountsByStatus> GetReemploymentCountPerStatus(int employeeId)
        {
            return await mediator.Send(new GetReemploymentsCountByStatusQuery(employeeId));
        }

        [HttpGet("GetReemploymentListForPagination", Name = "GetReemploymentListForPagination")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ReemploymentSearchResult> GetReemploymentListForPagination
            ( [FromQuery] ApprovalStatus Status,[FromQuery] int PageNumber,[FromQuery] int PageSize, int employeeId)
        {
            return await mediator.Send(new GetReemploymentListForPaginationQuery(Status, PageNumber, PageSize,employeeId));
        }

        [HttpGet("GetReemploymentById", Name = "GetReemploymentById")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<ReemploymentDto>> GetReemploymentById(int reemploymentId)
        {
            var reemployment = await mediator.Send(new GetReemploymentByIdQuery(reemploymentId));
            return Ok(reemployment);
        }
    }
}
