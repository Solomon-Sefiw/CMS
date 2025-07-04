using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.ApproveBenefitValue;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.CreateBenefitValue;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.RejectBenefitValue;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.SubmitBenefitValue;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.UpdateBenefitValue;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries;
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.BenefitController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BenefitValuesController : BaseController<BenefitValuesController>
    {

        [HttpPost("AddBenefitValue", Name = "AddBenefitValue")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddBenefitValue([FromBody] AddBenefitValueCommand command)
        {
            var benefitValue = await mediator.Send(command);
            return benefitValue;
        }

        [HttpPut("UpdateBenefitValue", Name = "UpdateBenefitValue")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBenefitValue([FromBody] UpdateBenefitValueCommand command)
        {
            var updatedBenefitValue = await mediator.Send(command);
            return updatedBenefitValue;
        }

        [HttpPost("SubmitBenefitValue", Name = "SubmitBenefitValue")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBenefitValue([FromBody] SubmitBenefitValueCommand command)
        {
            var submittedBenefitValue = await mediator.Send(command);
            return submittedBenefitValue;
        }

        [HttpPost("ApproveBenefitValue", Name = "ApproveBenefitValue")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBenefitValue([FromBody] ApproveBenefitValueCommand command)
        {
            var approvedBenefitValue = await mediator.Send(command);
            return approvedBenefitValue;
        }

        [HttpPost("RejectBenefitValue", Name = "RejectBenefitValue")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectBenefitValue([FromBody] RejectBenefitValueCommand command)
        {
            var rejectedBenefitValue = await mediator.Send(command);
            return rejectedBenefitValue;
        }

        [HttpGet("GetAllBenefitValueList", Name = "GetAllBenefitValueList")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitValueDto>>> GetAllBenefitValue()
        {
            var benefitValues = await mediator.Send(new GetAllBenefitValueQuery());

            return Ok(benefitValues);
        }

        [HttpGet("GetBenefitSetupList", Name = "GetBenefitSetupList")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitSetupDto>>> GetBenefitSetupList()
        {
            var benefitValues = await mediator.Send(new GetBenefitSetupListQuery());

            return Ok(benefitValues);
        }

        [HttpGet("GetBenefitValuesByBenefitId", Name = "GetBenefitValuesByBenefitId")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitValueDto>>> GetBenefitValuesListByBenefitId(int benefitId)
        {
            var benefitValues = await mediator.Send(new GetBenefitValuesByBenefitIdQuery(benefitId));

            return Ok(benefitValues);
        }

        [HttpGet("GetBenefitValueById", Name = "GetBenefitValueById")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitValueDto>>> GetBenefitValueById(int Id)
        {
            var benefitValues = await mediator.Send(new GetBenefitValueByIdQuery(Id));

            return Ok(benefitValues);
        }

        [HttpGet("GetBenefitValueCountPerStatus", Name = "GetBenefitValueCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitValueCountsByStatus> GetBenefitValueCountPerStatus()
        {
            return await mediator.Send(new GetBenefitValueCountPerStatusQuery());
        }

        [HttpGet("GetBenefitValueListForPagination", Name = "GetBenefitValueListForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitValueSearchResult> GetBenefitValueListForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetBenefitValueListForPaginationQuery(Status, PageNumber, PageSize));

        }
    }
}
