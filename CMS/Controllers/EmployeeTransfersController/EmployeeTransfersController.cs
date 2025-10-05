using CMS.API.Controllers;
using CMS.Application.Features.Transfer.Commands;
using CMS.Application.Features.Transfer.Model;
using CMS.Application.Features.Transfer.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeTransfersController
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTransfersController :BaseController<EmployeeTransfersController>
    {
        
        [HttpPost("AddEmployeeTransfer", Name = "AddEmployeeTransfer")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]

        public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferCommand command)
        {
            var transferId = await mediator.Send(command);

            return Ok(transferId);
        }

        [HttpPost("SubmitEmployeeTransfer", Name = "SubmitEmployeeTransfer")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]

        public async Task<IActionResult> SubmitTransfer([FromBody] SubmitTransferCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("RejectEmployeeTransfer", Name = "RejectEmployeeTransfer")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<IActionResult> RejectTransfer([FromBody] RejectTransferCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("ApproveEmployeeTransfer", Name = "ApproveEmployeeTransfer")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<IActionResult> ApproveTransfer([FromBody] ApproveTransferCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("UpdateEmployeeTransfer", Name = "UpdateEmployeeTransfer")]

        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<IActionResult> UpdateTransfer([FromBody] UpdateTransferCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("GetAllTransfersList", Name = "GetAllTransfersList")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<List<EmployeeTransferDto>>> GetAllTransfersList()
        {
            var result = await mediator.Send(new GetAllTransfersQuery());
            return Ok(result);
        }

        [HttpGet("GetTransferCountPerStatus", Name = "GetTransferCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<TransferCountsByStatus> GetTransferCountPerStatus(int employeeId)
        {
            return await mediator.Send(new GetTransferCountByStatusQuery(employeeId));
        }

        [HttpGet("GetTransferListForPagination", Name = "GetTransferListForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<TransferSearchResult> GetTransferListForPagination(
           [FromQuery] ApprovalStatus Status,
           [FromQuery] int PageNumber,
           [FromQuery] int PageSize, int employeeId)
        {
            return await mediator.Send(new GetTransferListForPaginationQuery(Status, PageNumber, PageSize,employeeId));
        }

        [HttpGet("GetEmployeeWithDetails", Name = "GetEmployeeWithDetails")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<EmployeeBasicInfoDto> GetEmployeeWithDetails(int id)
        {
            return await mediator.Send(new GetEmployeeWithDetailsQuery(id));
        }

    }
}
