using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Commands.ActivateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.ApproveBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.CloseBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.RejectBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.SubmitBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace CMS.API.Controllers.BusinessUnits
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessUnitController : BaseController<BusinessUnitController>
    {

        [HttpPost("CreateBusinessUnit", Name = "CreateBusinessUnit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateBusinessUnit([FromBody] CreateBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpGet("all", Name = "GetAllBusinessUnits")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<BusinessUnitLists>> GetAllBusinessUnits()
        {
            var searchResult = await mediator.Send(new GetBusinessUnitsQuery());
            return searchResult;
        }

        [HttpGet("countsByBusinssUnitId", Name = "GetEmployeeCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        public async Task<EmployeeCountsByStatus> GetEmployeeCountPerApprovalStatus(int? businssUnitId)
        {
            return await mediator.Send(new GetEmployeeCountQuery(businssUnitId));
        }

        [HttpGet("search", Name = "SearchAllBusinessUnits")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BusinessUnitDto>>> SearchAllBusinessUnits()
        {
            var searchResult = await mediator.Send(new SearchBusinessUnitsQuery());
            return searchResult;
        }


        [HttpGet("SearchBusinessUnits")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BusinessUnitDto>>> SearchBusinessUnits([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 3)
                return BadRequest("Query must be at least 3 characters long.");
            var result = await mediator.Send(new SearchBusinessUnitQuery(query));
            return Ok(result);
        }


        [HttpPut("update", Name = "UpdateBusinessUnit")]
        [ProducesResponseType(200)]
       // [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBusinessUnit([FromBody] UpdateBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpPatch("submit", Name = "SubmitBusinessUnit")]
        [ProducesResponseType(200)]
      //  [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBusinessUnit([FromBody] SubmitBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpPatch("approve", Name = "ApproveBusinessUnit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBusinessUnit([FromBody] ApproveBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpPatch("Reject", Name = "RejectBusinessUnit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectBusinessUnit([FromBody] RejectBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpPatch("activate", Name = "ActivateBusinessUnit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canActivateSetup)]
        public async Task<ActionResult<int>> ActivateBusinessUnit([FromBody] ActivateBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpPatch("deactivate", Name = "DeactivateBusinessUnit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canDeactivateSetup)]
        public async Task<ActionResult<int>> DeactivateBusinessUnit([FromBody] DeActiveBusinessUnitCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }


        [HttpGet("allBusinessUnit", Name = "GetAllBuisnessUnitLists")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<BusinessUnitSearchResult>> GetAllBuisnessUnitLists(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetBusinessUnitsListQuery(status, pageNumber, pageSize));

            return searchResult;
        }


        [HttpGet("counts", Name = "GetBusinessUnitCountPerApprovalStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BusinessUnitCountsByStatus> GetBusinessUnitCountPerApprovalStatus()
        {
            return await mediator.Send(new GetBusinessUnitCountPerApprovalStatusQuery());
        }


    }
}
