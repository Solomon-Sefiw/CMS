using CMS.API.Controllers;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.ApproveJobRoleCatagory;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.CreateJobRoleCatagory;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.RejectJobRoleCatagory;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.SubmitJobRoleCatagory;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Commands.UpdateJobRoleCatagory;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.API.Attributes;
namespace CMS.Api.Controllers.JobController
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobRoleCategoryController : BaseController<JobRoleCategoryController>
    {
        [HttpPost("Create", Name = "CreateJobRoleCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> CreateJobRoleCategory([FromBody] CreateJobRoleCatagoryCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("search", Name = "SearchAllJobRoleCatagories")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<JobRoleCatagoryDto>>> SearchAllJobRoleCatagories()
        {
            var searchResult = await mediator.Send(new SearchAllJobRoleCatagoriesQuery());
            return searchResult;
        }

        [HttpGet("GetAll", Name = "GetAllJobRoleCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobRoleCatagoryLists>> GetAllJobRoleCategory()
        {
            return Ok(await mediator.Send(new GetAllJobRoleCatagoriesQuery()));
        }

        [HttpGet("GetJobRoleCategoriesForPagination", Name = "GetJobRoleCategoriesForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<PaginatedJobRoleCatagoryList>> GetJobRoleCategoriesForPagination(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetPaginatedJobRoleCatagoriesQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("count", Name = "GetJobRoleCategoryCountPerStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<JobRoleCatagoryCountsByStatus> GetJobRoleCategoryCountPerStatus()
        {
            return await mediator.Send(new GetJobRoleCatagoryCountPerStatusQuery());
        }


        [HttpPut("Update", Name = "UpdateJobRoleCategory")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> UpdateJobRoleCategory(UpdateJobRoleCatagoryCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpPatch("submit", Name = "SubmitJobRoleCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitJobRoleCategory([FromBody] SubmitJobRoleCatagoryCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("approve", Name = "ApproveJobRoleCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveJobRoleCategory([FromBody] ApproveJobRoleCatagoryCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
        [HttpPatch("Reject", Name = "RejectJobRoleCategory")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectJobRoleCategory([FromBody] RejectJobRoleCatagoryCommand command)
        {
            var businessUnitId = await mediator.Send(command);
            return Ok(businessUnitId);
        }
    }

}

