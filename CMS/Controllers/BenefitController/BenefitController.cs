using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Benefits.Commands.ApproveBenefit;
using CMS.Application.Features.Benefits.Commands.CreateBenefit;
using CMS.Application.Features.Benefits.Commands.RejectBenefit;
using CMS.Application.Features.Benefits.Commands.SubmitBenefit;
using CMS.Application.Features.Benefits.Commands.UpdateBenefit;
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Benefits.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.BenefitController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BenefitController : BaseController<BenefitController>
    {

        [HttpPost("AddBenefit", Name = "AddBenefit")]
        [InvalidateQueryTags("Dashboard", "BenefitUnitPrice")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddBenefit([FromBody] AddBenefitCommand command)
        {
            var benefit = await mediator.Send(command);
            return (benefit);
        }

        [HttpPut("UpdateBenefit", Name = "UpdateBenefit")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBenefit([FromBody] UpdateBenefitCommand command)
        {
            var updatedBenefit = await mediator.Send(command);
            return (updatedBenefit);
        }

        [HttpPost("SubmitBenefit", Name = "SubmitBenefit")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBenefit([FromBody] SubmitBenefitCommand command)
        {
            var submittedBenefit = await mediator.Send(command);
            return (submittedBenefit);
        }

        [HttpPost("ApproveBenefit", Name = "ApproveBenefit")]
        [InvalidateQueryTags("Dashboard", "BenefitUnitPrice")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBenefit([FromBody] ApproveBenefitCommand command)
        {
            var approvedBenefit = await mediator.Send(command);
            return (approvedBenefit);
        }

        [HttpPost("RejectBenefit", Name = "RejectBenefit")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectBenefit([FromBody] RejectBenefitCommand command)
        {
            var rejectedBenefit = await mediator.Send(command);
            return (rejectedBenefit);
        }
        //GetAllUnitPricedBenefitQuery

        [HttpGet("GetAllUnitPricedBenefitlist", Name = "GetAllUnitPricedBenefitlist")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitDto>>> GetAllUnitPricedBenefitlist()
        {
            return await mediator.Send(new GetAllUnitPricedBenefitQuery());
        }

        [HttpGet("GetAllBenefitList", Name = "GetAllBenefitList")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BenefitDto>>> GetAllBenefitList()
        {
            return await mediator.Send(new GetAllBenefitsQuery());
        }

        [HttpGet("GetBenefitCountPerStatus", Name = "GetBenefitCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitCountsByStatus> GetBenefitCountPerStatus()
        {
            return await mediator.Send(new GetBenefitCountByStatusQuery());
        }

        [HttpGet("GetBenefitListForPagination", Name = "GetBenefitListForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<BenefitSearchResult> GetBenefitListForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetBenefitListForPaginationQuery(Status, PageNumber, PageSize));

        }
    }
}
