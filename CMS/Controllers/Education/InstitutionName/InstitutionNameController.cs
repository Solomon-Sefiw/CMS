using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Educations.Setups.InstitutionName.Commands.ApproveInstitutionName;
using CMS.Application.Features.Educations.Setups.InstitutionName.Commands.CreateInstitutionName;
using CMS.Application.Features.Educations.Setups.InstitutionName.Commands.RejectInstitutionName;
using CMS.Application.Features.Educations.Setups.InstitutionName.Commands.SubmitInstitutionName;
using CMS.Application.Features.Educations.Setups.InstitutionName.Commands.UpdateInstitutionName;
using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.Education.InstitutionName
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstitutionNameController : BaseController<InstitutionNameController>
    {

        [HttpPost("create", Name = "CreateInstitutionName")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(int))] // Returns the ID of the created award
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> CreateInstitutionName([FromBody] CreateInstitutionNameCommand command)
        {
            var awardId = await mediator.Send(command);
            return Ok(awardId);
        }


        [HttpPut("update", Name = "UpdateInstitutionName")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] // Successful update
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Validation errors
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> UpdateInstitutionName([FromBody] UpdateInstitutionNameCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("GetAll", Name = "GetAllInstitutionName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<InstitutionNameLists>> GetAllInstitutionName()
        {
            return Ok(await mediator.Send(new GetAllInstitutionNamesQuery()));
        }
        [HttpGet("search", Name = "SearchAllInstitutionNames")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<InstitutionNameDto>>> SearchAllInstitutionNames()
        {
            var searchResult = await mediator.Send(new SearchAllInstitutionNameQuery());
            return searchResult;
        }

        [HttpGet("GetInstitutionNamesForPagination", Name = "GetInstitutionNamesForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedInstitutionNameList>> GetInstitutionNamesForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedInstitutionNamesQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetInstitutionNameCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<InstitutionNameCountsByStatus> GetInstitutionNameCountPerStatus()
        {
            return await mediator.Send(new GetInstitutionNameCountPerStatusQuery());
        }

        [HttpPatch("submit", Name = "SubmitInstitutionName")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitInstitutionName([FromBody] SubmitInstitutionNameCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveInstitutionName")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveInstitutionName([FromBody] ApproveInstitutionNameCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectInstitutionName")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectInstitutionName([FromBody] RejectInstitutionNameCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }

    }
}
