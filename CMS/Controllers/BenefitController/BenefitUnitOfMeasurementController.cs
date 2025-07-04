using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.ApproveBenefitUnitOfMeasurement;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.CreateBenefitUnitOfMeasurement;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.RejectBenefitUnitOfMeasurement;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.UpdateBenefitUnitOfMeasurement;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.BenefitController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BenefitUnitOfMeasurementController : BaseController<BenefitUnitOfMeasurementController>
    {
        [HttpPost("AddBenefitUnitOfMeasurement", Name = "AddBenefitUnitOfMeasurement")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddBenefitUnitOfMeasurement([FromBody] AddBenefitUnitOfMeasurementCommand command)
        {
            var unitOfMeasurement = await mediator.Send(command);
            return unitOfMeasurement;
        }

        [HttpPut("UpdateBenefitUnitOfMeasurement", Name = "UpdateBenefitUnitOfMeasurement")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBenefitUnitOfMeasurement([FromBody] UpdateBenefitUnitOfMeasurementCommand command)
        {
            var updatedUnitOfMeasurement = await mediator.Send(command);
            return updatedUnitOfMeasurement;
        }

        [HttpPost("SubmitBenefitUnitOfMeasurement", Name = "SubmitBenefitUnitOfMeasurement")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBenefitUnitOfMeasurement([FromBody] SubmitBenefitUnitOfMeasurementCommand command)
        {
            var submittedUnitOfMeasurement = await mediator.Send(command);
            return submittedUnitOfMeasurement;
        }

        [HttpPost("ApproveBenefitUnitOfMeasurement", Name = "ApproveBenefitUnitOfMeasurement")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBenefitUnitOfMeasurement([FromBody] ApproveBenefitUnitOfMeasurementCommand command)
        {
            var approvedUnitOfMeasurement = await mediator.Send(command);
            return approvedUnitOfMeasurement;
        }

        [HttpPost("RejectBenefitUnitOfMeasurement", Name = "RejectBenefitUnitOfMeasurement")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectBenefitUnitOfMeasurement([FromBody] RejectBenefitUnitOfMeasurementCommand command)
        {
            var rejectedUnitOfMeasurement = await mediator.Send(command);
            return rejectedUnitOfMeasurement;
        }

        [HttpGet("GetAllBenefitUnitOfMeasurementList", Name = "GetAllBenefitUnitOfMeasurementList")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitUnitOfMeasurementDto>>> GetAllBenefitUnitOfMeasurementList()
        {
            var unitOfMeasurement = await mediator.Send(new GetAllBenefitUnitOfMeasurementQuery());

            return Ok(unitOfMeasurement);
        }

        [HttpGet("GetBenefitUnitOfMeasurementCountPerStatus", Name = "GetBenefitUnitOfMeasurementCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitUnitOfMeasurementCountsByStatus> GetBenefitUnitOfMeasurementCountPerStatus()
        {
            return await mediator.Send(new GetBenefitUnitOfMeasurementCountPerStatusQuery());
        }

        [HttpGet("GetBenefitUnitOfMeasurementListForPagination", Name = "GetBenefitUnitOfMeasurementListForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitUnitOfMeasurementSearchResult> GetBenefitUnitOfMeasurementListForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetBenefitUnitOfMeasurementListForPaginationQuery(Status, PageNumber, PageSize));

        }
    }
}
