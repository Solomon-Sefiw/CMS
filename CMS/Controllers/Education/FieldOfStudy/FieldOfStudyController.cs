using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.ApproveFieldOfStudy;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.CreateFieldOfStudy;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.RejectFieldOfStudy;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.SubmitFieldOfStudy;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.UpdateFieldOfStudy;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Education.FieldOfStudy
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldOfStudyController : BaseController<FieldOfStudyController>
    {


        [HttpPost("create", Name = "CreateFieldOfStudy")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(int))] // Returns the ID of the created award
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> CreateFieldOfStudy([FromBody] CreateFieldOfStudyCommand command)
        {
            var fieldOfStudyId = await mediator.Send(command);
            return Ok(fieldOfStudyId);
        }


        [HttpPut("update", Name = "UpdateFieldOfStudy")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // Successful update
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> UpdateFieldOfStudy([FromBody] UpdateFieldOfStudyCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("GetAll", Name = "GetAllFieldOfStudy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<FieldOfStudyLists>> GetAllFieldOfStudy()
        {
            return Ok(await mediator.Send(new GetAllFieldOfStudiesQuery()));
        }
        [HttpGet("search", Name = "SearchAllFieldOfStudies")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<FieldOfStudyDto>>> SearchAllFieldOfStudies()
        {
            var searchResult = await mediator.Send(new SearchAllFieldOfStudyQuery());
            return searchResult;
        }

        [HttpGet("GetFieldOfStudiesForPagination", Name = "GetFieldOfStudiesForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedFieldOfStudyList>> GetFieldOfStudiesForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedFieldOfStudiesQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetFieldOfStudyCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<FieldOfStudyCountsByStatus> GetFieldOfStudyCountPerStatus()
        {
            return await mediator.Send(new GetFieldOfStudyCountPerStatusQuery());
        }

        [HttpPatch("submit", Name = "SubmitFieldOfStudy")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitFieldOfStudy([FromBody] SubmitFieldOfStudyCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveFieldOfStudy")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveFieldOfStudy([FromBody] ApproveFieldOfStudyCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectFieldOfStudy")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectFieldOfStudy([FromBody] RejectFieldOfStudyCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }

    }
}
