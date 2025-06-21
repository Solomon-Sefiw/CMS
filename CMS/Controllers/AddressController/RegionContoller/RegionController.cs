using CMS.API.Attributes;
using CMS.Application.Features.Addresses.Setups.Commands.CreateRegion;
using CMS.Application.Features.Addresses.Setups.Commands.UpdateRegion;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Region.Commands.ApproveRegion;
using CMS.Application.Features.Addresses.Setups.Region.Commands.RejectRegion;
using CMS.Application.Features.Addresses.Setups.Region.Commands.SubmitRegion;
using CMS.Application.Features.Addresses.Setups.Region.Queiries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.AddressController.RegionContoller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionController : BaseController<RegionController>
    {
        [HttpPost("Create", Name = "CreateRegion")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateRegion([FromBody] CreateRegionCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetAll",Name = "GetAllRegion") ]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy =AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<RegionLists>> GetAllRegion()
        {
            return Ok(await mediator.Send(new GetAllRegionsQuery()));
        }

        [HttpGet("search", Name = "SearchAllRegions")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<RegionDto>>> SearchAllRegions()
        {
            var searchResult = await mediator.Send(new SearchAllRegionsQuery());
            return searchResult;
        }

        [HttpGet("GetRegionsForPagination", Name = "GetRegionsForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedRegionList>> GetRegionsForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedRegionsQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetRegionCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<RegionCountsByStatus> GetRegionCountPerStatus()
        {
            return await mediator.Send(new GetRegionCountPerStatusQuery());
        }


        [HttpPut("Update", Name = "UpdateRegion")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateRegion(UpdateRegionCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitRegion")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitRegion([FromBody] SubmitRegionCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveRegion")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveRegion([FromBody] ApproveRegionCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectRegion")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectRegion([FromBody] RejectRegionCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
    }
}
