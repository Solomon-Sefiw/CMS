using CMS.Api.Dtos;
using CMS.API.Attributes;
using CMS.Application;
using CMS.Application.Features;
using CMS.Application.Features.Cases.Queries;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.Commands.UpdateEmployee;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace CMS.API.Controllers.EmployeeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseController : BaseController<CaseController>
    {

        [HttpPost("add", Name = "CreateCase")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<CreateCaseReturnType>> CreateCase([FromBody] CreateCaseCommand employeeProfile)
        {
            var employeeId = await mediator.Send(employeeProfile);
            return Ok(employeeId);
        }

        [HttpGet("counts", Name = "GetCaseCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        public async Task<CaseCountsByStatus> GetCaseCountPerApprovalStatus()
        {
            return await mediator.Send(new GetCaseCountQuery());
        }



        [HttpPost("update", Name = "UpdateCase")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateCase([FromBody] UpdateCaseCommand basicInfo)
        {
            var employeeId = await mediator.Send(basicInfo);
            return Ok(employeeId);
        }

        [HttpGet("all", Name = "GetAllCases")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<CaseDto>>> GetAllCases()
        {
            var searchResult = await mediator.Send(new GetCaseListQuery());
            return searchResult;
        }

        [HttpGet("{id}/businessUnit", Name = "GetCaseByBusinessUnitId")]
        [ProducesResponseType(200)]
        public async Task<List<CaseDto>> GetCaseByBusinessUnitId(int id)
        {
            var employee = await mediator.Send(new GetCaseListByBusinessUnitId { Id = id });
            return employee;
        }

        [HttpGet("allByStatus", Name = "GetAllCasesByStatus")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<CaseList>> GetAllCasesByStatus()
        {
            var searchResult = await mediator.Send(new GetCaseListByStatusQuery());
            return searchResult;
        }

        [HttpGet("{id}/info", Name = "GetCaseInfo")]
        [ProducesResponseType(200)]
        public async Task<CaseDto> GetCaseInfo(int id, [FromQuery] Guid? version = null)
        {
            var employee = await mediator.Send(new GetCaseInfoQuery(id, version));
            return employee;
        }

        [HttpGet("{id}", Name = "GetCaseById")]
        [ProducesResponseType(200)]
        public async Task<CaseDetailsDto> GetCaseById(int id)
        {
            var employee = await mediator.Send(new GetCaseDetailQuery { Id = id });
            return employee;
        }

        [HttpGet("allCases", Name = "GetAllCaseLists")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<CaseSearchResult>> GetAllCaseLists(
    int businessUnitId,
    ApprovalStatus Status,
    int pageNumber,
    int pageSize,
    string? searchQuery) // <--- ADDED: Optional searchQuery parameter
        {
            var searchResult = await mediator.Send(new GetCaseListWithPaginationQuery(
                Status,
                pageNumber,
                pageSize,
                searchQuery // <--- PASSED: searchQuery to the MediatR query
            ));

            return searchResult;
        }
        // this is small change
        [HttpGet("{id}/record-versions", Name = "GetCaseRecordVersions")]
        [ProducesResponseType(200)]
        public async Task<ActionResult> SubmitCaseForApproval([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new SubmitCaseApprovalRequestCommand(payload.Id, payload.Note));
            return Ok();
        }

        [HttpPost("approve-approval-request", Name = "ApproveCase")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        public async Task<ActionResult> ApproveCase([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new ApproveCaseCommand(payload.Id, payload.Note));
            return Ok();
        }

        [HttpPost("reject-approval-request", Name = "RejectCaseApprovalRequest")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        public async Task<ActionResult> RejectCaseApprovalRequest([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new RejectCaseApprovalRequestCommand(payload.Id, payload.Note));
            return Ok();
        }

    }
}
