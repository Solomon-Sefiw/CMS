using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.ApproveChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.CreateChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.RejectChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.SubmitChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.UpdateChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Queries;
using CMS.Application.Features.Educations.Setups.Award.Commands.ApproveAward;
using CMS.Application.Features.Educations.Setups.Award.Commands.CreateAward;
using CMS.Application.Features.Educations.Setups.Award.Commands.RejectAward;
using CMS.Application.Features.Educations.Setups.Award.Commands.SubmitAward;
using CMS.Application.Features.Educations.Setups.Award.Commands.UpdateAward;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.Award.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChilotController : BaseController<ChilotController>
    {
        [HttpGet("by-business/{businessUnitId}")]
        public async Task<List<ChilotDto>> GetChilotByBusinessUnit(int businessUnitId)
            => await mediator.Send(new GetChilotsByBusinessUnitIdQuery(businessUnitId));
        [HttpPost("create", Name = "CreateChilot")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(int))] // Returns the ID of the created award
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateChilot([FromBody] CreateChilotCommand command)
        {
            var awardId = await mediator.Send(command);
            return Ok(awardId);
        }
        [HttpPut("update", Name = "UpdateChilot")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // Successful update
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateChilot([FromBody] UpdateChilotCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("GetAll", Name = "GetAllChilot")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<ChilotLists>> GetAllChilot()
        {
            return Ok(await mediator.Send(new GetAllChilotsQuery()));
        }
        [HttpGet("search", Name = "SearchAllChilots")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<ChilotDto>>> SearchAllChilots()
        {
            var searchResult = await mediator.Send(new SearchAllChilotQuery());
            return searchResult;
        }

        [HttpGet("GetChilotsForPagination", Name = "GetChilotsForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedChilotList>> GetChilotsForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedChilotsQuery(status, pageNumber, pageSize));
            return searchResult;
        }
        [HttpGet("count", Name = "GetChilotCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ChilotCountsByStatus> GetChilotCountPerStatus()
        {
            return await mediator.Send(new GetChilotCountPerStatusQuery());
        }

        [HttpPatch("submit", Name = "SubmitChilot")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitChilot([FromBody] SubmitChilotCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveChilot")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveChilot([FromBody] ApproveChilotCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectChilot")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectChilot([FromBody] RejectChilotCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


    }
}
