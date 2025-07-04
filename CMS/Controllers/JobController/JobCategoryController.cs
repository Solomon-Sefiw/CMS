using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Jobs.JobCatagories.Command.ActivateDeactivateJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.ApproveJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.CreateJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.DeleteJobCatatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.RejectJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.SubmitJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Query;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.JobController
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobCategoryController : BaseController<JobCategoryController>
    {
        //api for jobcatagory
        [HttpPost("CreateJobCategory", Name = "CreateJobCategoy")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateJobCategoy([FromBody] CreateJobCategoryCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("UpdateJobCategory", Name = "UpdateJobCategory")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<IActionResult> UpdateJobCategory([FromBody] UpdateJobCategoryCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("ApproveJobCategory/{id}", Name = "ApproveJobCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<IActionResult> ApproveJobCatagory(int id)
        {
            var result = await mediator.Send(new ApproveJobCategoryCommand { Id = id });
            return Ok(result);
        }

        [HttpPut("RejectJobCategory", Name = "RejectJobCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<IActionResult> RejectJobCategory([FromBody] RejectJobCategoryCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("SubmitJobCategory/{id}", Name = "SubmitJobCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<IActionResult> SubmitJobCategory(int id)
        {
            var result = await mediator.Send(new SubmitJobCategoryCommand { Id = id });
            return Ok(result);
        }

        [HttpPut("ActivateJobCategory/{id}", Name = "ActivateJobCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canActivateSetup)]
        public async Task<IActionResult> ActivateJobCategory(int id)
        {
            var result = await mediator.Send(new ActivateJobCategoryCommand { Id = id });
            return Ok(result);
        }

        [HttpPut("DeactivateJobCategoy/{id}", Name = "DeactivateJobCategoy")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canDeactivateSetup)]
        public async Task<IActionResult> DeactivateJobCategoy(int id)
        {
            var result = await mediator.Send(new DeactivateJobCategoryCommand { Id = id });
            return Ok(result);
        }

        [HttpDelete("DeleteJobCategory/{id}", Name = "DeleteJobCategory")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canDeactivateSetup)]
        public async Task<IActionResult> DeleteJobCategory(int id)
        {
            var command = new DeleteJobCategoryCommand { Id = id };
            var result = await mediator.Send(command);

            if (!result.Succeeded)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        [HttpGet("GetJobCategoryById/{id}", Name = "GetJobCategoryById")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<IActionResult> GetJobCategoryById(int id)
        {
            var result = await mediator.Send(new GetJobCategoryByIdQuery(id));
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("GetJobCategoryListQuery", Name = "GetJobCategoryListQuery")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<IActionResult> GetJobCatagoryListQuery()
        {
            var result = await mediator.Send(new GetJobCategoryListQuery());
            return Ok(result);
        }
        [HttpGet("GetJobCategoryCountByApprovalStatus", Name = "GetJobCategoryCountByApprovalStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobCategoryCountsByStatus>> GetJobCategoryCountByApprovalStatus()
        {
            var result = await mediator.Send(new GetJobCategoryCountPerApprovalStatusQuery());
            return Ok(result);
        }
        [HttpGet("GetJobCategoriesListForPaginationQuery", Name = "GetJobCategoriesListForPaginationQuery")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobCategorySearchResult>> GetJobCategoriesListForPaginationQuery([FromQuery] ApprovalStatus status, int pageNumber = 1, int pageSize = 10)
        {
            var result = await mediator.Send(new GetJobCategoriesListForPaginationQuery(status, pageNumber, pageSize));
            return Ok(result);
        }

        [HttpGet("GetAll", Name = "GetAllJobCategory")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobCategoryLists>> GetAllJobCategory()
        {
            return Ok(await mediator.Send(new GetAllJobCategoriesQuery()));
        }

    }
}
