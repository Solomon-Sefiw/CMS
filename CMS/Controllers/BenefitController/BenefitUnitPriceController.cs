using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrice.Commands.CreateBenefitUnitPrice;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.ApproveBenefitUnitPrice;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.RejectBenefitUnitPrice;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.SubmitBenefitUnitPrice;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.UpdateBenefitUnitPrice;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Application.Features.Benefits.Commands.ApproveBenefit;
using CMS.Application.Features.Benefits.Commands.RejectBenefit;
using CMS.Application.Features.Benefits.Commands.SubmitBenefit;
using CMS.Application.Security;
using CMS.Domain.Benefit;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.BenefitController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BenefitUnitPriceController : BaseController<BenefitUnitPriceController>
    {
        [HttpPost("AddBenefitUnitPrice", Name = "AddBenefitUnitPrice")]
        [InvalidateQueryTags("Dashboard", "BenefitUnitPrice")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddBenefitUnitPrice([FromBody] AddBenefitUnitPriceCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("UpdateBenefitUnitPrice", Name = "UpdateBenefitUnitPrice")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBenefitUnitPrice([FromBody] UpdateBenefitUnitPriceCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("SubmitBenefitUnitPrice", Name = "SubmitBenefitUnitPrice")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBenefitUnitPrice([FromBody] SubmitBenefitUnitPriceCommand command)
        {
            var submittedBenefit = await mediator.Send(command);
            return (submittedBenefit);
        }

        [HttpPost("ApproveBenefitUnitPrice", Name = "ApproveBenefitUnitPrice")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBenefitUnitPrice([FromBody] ApproveBenefitUnitPriceCommand command)
        {
            var approvedBenefit = await mediator.Send(command);
            return (approvedBenefit);
        }

        [HttpPost("RejectBenefitUnitPrice", Name = "RejectBenefitUnitPrice")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectBenefitUnitPrice([FromBody] RejectBenefitUnitPriceCommand command)
        {
            var rejectedBenefit = await mediator.Send(command);
            return (rejectedBenefit);
        }

        [HttpGet("GetAllBenefitUnitPriceList", Name = "GetAllBenefitUnitPriceList")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitValueDto>>> GetAllBenefitUnitPric()
        {
            var benefitValues = await mediator.Send(new GetAllBenefitUnitPriceQuery());

            return Ok(benefitValues);
        }

        [HttpGet("GetBenefitUnitPriceCountPerStatus", Name = "GetBenefitUnitPriceCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitUnitPriceCountsByStatus> GetBenefitUnitPriceCountPerStatus()
        {
            return await mediator.Send(new GetBenefitUnitPriceCountPerStatusQuery());
        }

        [HttpGet("GetBenefitUnitPriceListForPagination", Name = "GetBenefitUnitPriceListForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitUnitPriceSearchResult> GetBenefitUnitPriceListForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetBenefitUnitPriceListForPaginationQuery(Status, PageNumber, PageSize));

        }
    }
}
