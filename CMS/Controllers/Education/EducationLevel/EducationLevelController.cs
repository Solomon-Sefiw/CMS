using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Educations.Setups.EducationLevel.Commands.ApproveEducationLevel;
using CMS.Application.Features.Educations.Setups.EducationLevel.Commands.CreateEducationLevel;
using CMS.Application.Features.Educations.Setups.EducationLevel.Commands.RejectEducationLevel;
using CMS.Application.Features.Educations.Setups.EducationLevel.Commands.SubmitEducationLevel;
using CMS.Application.Features.Educations.Setups.EducationLevel.Commands.UpdateEducationLevel;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Education.EducationLevel
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationLevelController : BaseController<EducationLevelController>
    {
        [HttpPost("create", Name = "CreateEducationLevel")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(int))] // Returns the ID of the created award
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> CreateEducationLevel([FromBody] CreateEducationLevelCommand command)
        {
            var educationLevelId = await mediator.Send(command);
            return Ok(educationLevelId);
        }


        [HttpPut("update", Name = "UpdateEducationLevel")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // Successful update
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> UpdateEducationLevel([FromBody] UpdateEducationLevelCommand  command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("GetAll", Name = "GetAllEducationLevel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<EducationLevelLists>> GetAllEducationLevel()
        {
            return Ok(await mediator.Send(new GetAllEducationLevelsQuery()));
        }
        [HttpGet("search", Name = "SearchAllEducationLevels")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<EducationLevelDto>>> SearchAllEducationLevels()
        {
            var searchResult = await mediator.Send(new SearchAllEducationLevelQuery());
            return searchResult;
        }

        [HttpGet("GetEducationLevelsForPagination", Name = "GetEducationLevelsForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedEducationLevelList>> GetEducationLevelsForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedEducationLevelsQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetEducationLevelCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<EducationLevelCountsByStatus> GetEducationLevelCountPerStatus()
        {
            return await mediator.Send(new GetEducationLevelCountPerStatusQuery());
        }

        [HttpPatch("submit", Name = "SubmitEducationLevel")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitEducationLevel([FromBody] SubmitEducationLevelCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveEducationLevel")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveEducationLevel([FromBody] ApproveEducationLevelCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectEducationLevel")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectEducationLevel([FromBody] RejectEducationLevelCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }

    }
}
