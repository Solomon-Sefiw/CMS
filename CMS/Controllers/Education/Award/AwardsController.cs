using CMS.API.Attributes;
using CMS.API.Controllers;
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
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Education.Award
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwardsController : BaseController<AwardsController>
    {
        [HttpPost("create", Name = "CreateAward")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(int))] // Returns the ID of the created award
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateAward([FromBody] CreateAwardCommand command)
        {
                var awardId = await mediator.Send(command);
                return Ok(awardId);
        }
        [HttpPut("update", Name = "UpdateAward")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // Successful update
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateAward([FromBody] UpdateAwardCommand command)
        {
                var response = await mediator.Send(command);
                return Ok(response);
        }

        [HttpGet("GetAll", Name = "GetAllAward")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<AwardLists>> GetAllAward()
        {
            return Ok(await mediator.Send(new GetAllAwardsQuery()));
        }
        [HttpGet("search", Name = "SearchAllAwards")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<AwardDto>>> SearchAllAwards()
        {
            var searchResult = await mediator.Send(new SearchAllAwardQuery());
            return searchResult;
        }

        [HttpGet("GetAwardsForPagination", Name = "GetAwardsForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedAwardList>> GetAwardsForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedAwardsQuery(status, pageNumber, pageSize));
            return searchResult;
        }
        [HttpGet("count", Name = "GetAwardCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<AwardCountsByStatus> GetAwardCountPerStatus()
        {
            return await mediator.Send(new GetAwardCountPerStatusQuery());
        }

        [HttpPatch("submit", Name = "SubmitAward")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitAward([FromBody] SubmitAwardCommand command) 
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveAward")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveAward([FromBody] ApproveAwardCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectAward")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectAward([FromBody] RejectAwardCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
    }
}
