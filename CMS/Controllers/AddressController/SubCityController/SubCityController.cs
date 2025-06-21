using CMS.API.Attributes;
using CMS.Application.Features.Addresses.Setups.Commands.CreateSubCity;
using CMS.Application.Features.Addresses.Setups.Commands.UpdateSubCity;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Queiries;
using CMS.Application.Features.Addresses.Setups.SubCity.Commands.ApproveSubCity;
using CMS.Application.Features.Addresses.Setups.SubCity.Commands.RejectSubCity;
using CMS.Application.Features.Addresses.Setups.SubCity.Commands.SubmitSubCity;
using CMS.Application.Features.Addresses.Setups.SubCity.Queiries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.AddressController.SubCityController
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCityController : BaseController<SubCityController>
    {

        [HttpPost("Create", Name = "CreateSubCity")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateSubCity([FromBody] CreateSubCityCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetAll", Name = "GetAllSubCity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<SubCityLists>> GetAllSubCity()
        {
            return Ok(await mediator.Send(new GetAllSubCitiesQuery()));
        }
        [HttpGet("search", Name = "SearchAllSubCities")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<SubCityDto>>> SearchAllSubCities()
        {
            var searchResult = await mediator.Send(new SearchAllSubCitiesQuery());
            return searchResult;
        }

        [HttpGet("GetSubCitiesForPagination", Name = "GetSubCitiesForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedSubCityList>> GetSubCitiesForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedSubCitesQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetSubCityCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<SubCityCountsByStatus> GetSubCityCountPerStatus()
        {
            return await mediator.Send(new GetSubCityCountPerStatusQuery());
        }



        [HttpPut("Update", Name = "UpdateSubCity")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateSubCity(UpdateSubCityCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitSubCity")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitSubCity([FromBody] SubmitSubCityCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveSubCity")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveSubCity([FromBody] ApproveSubCityCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectSubCity")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectSubCity([FromBody] RejectSubCityCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
    }
}
