using CMS.API.Controllers;
using CMS.Application.Features.BranchGrades.Commands.ApproveBranchGrade;
using CMS.Application.Features.BranchGrades.Commands.CreateBranchGrade;
using CMS.Application.Features.BranchGrades.Commands.RejectBranchGrade;
using CMS.Application.Features.BranchGrades.Commands.SubmitBranchGrade;
using CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade;
using CMS.Application.Features.BranchGrades.Model;
using CMS.Application.Features.BranchGrades.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.API.Attributes;

namespace CMS.Api.Controllers.BranchGradeController
{
    public class BranchGradeController : BaseController<BranchGradeController>
    {
        [HttpPost("AddBranchGrade", Name = "AddBranchGrade")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddBranchGrade([FromBody] AddBranchGradeCommand command)
        {
            var branchGrade = await mediator.Send(command);
            return (branchGrade);
        }
        [HttpPut("UpdateBranchGrade", Name = "UpdateBranchGrade")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateBranchGrade([FromBody] UpdateBranchGradeCommand command)
        {
            var updatedBranchGrade = await mediator.Send(command);
            return (updatedBranchGrade);
        }
        [HttpPost("SubmitBranchGrade", Name = "SubmitBranchGrade")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitBranchGrade([FromBody] SubmitBranchGradeCommand command)
        {
            var submittedBranchGrade = await mediator.Send(command);
            return (submittedBranchGrade);
        }
        [HttpPost("ApproveBranchGrade", Name = "ApproveBranchGrade")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveBranchGrade([FromBody] ApproveBranchGradeCommand command)
        {
            var approvedBranchGrade = await mediator.Send(command);
            return (approvedBranchGrade);
        }
        [HttpPost("RejectBranchGrade", Name = "RejectBranchGrade")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectBranchGrade([FromBody] RejectBranchGradeCommand command)
        {
            var rejectedBranchGrade = await mediator.Send(command);
            return (rejectedBranchGrade);
        }
        [HttpGet("GetAllBranchGradeList", Name = "GetAllBranchGradeList")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<BranchGradeDto>>> GetAllBranchGradeList()
        {
            var branchGrade = await mediator.Send(new GetAllBranchGradeQuery());

            return Ok(branchGrade);
        }
        [HttpGet("BranchGradeCountsBystatus", Name = "GetBranchGradeCountPerStatusQuery")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        public async Task<BranchGradeCountsByStatus> GetBranchGradeCountPerStatus()
        {
            return await mediator.Send(new GetBranchGradeCountPerStatusQuery());
        }
        [HttpGet("GetBranchGradeForPagination", Name = "GetBranchGradesForPagination")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        public async Task<BranchGradeSearchResult> GetBranchGradeForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetBranchGradeListForPaginationQuery(Status, PageNumber, PageSize));
        }
        [HttpGet("GetBranchGradeByDescription",Name = "GetBranchGradeByDescription")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<BranchGradeDto>>> GetBranchGradeByDescription([FromQuery] string description)
        {
            var result = await mediator.Send(new GetBranchGradeByDescriptionQuery(description));

            if (result == null)
                return NoContent(); 
            return Ok(result);
        }
    }
}
