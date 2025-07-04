
using CMS.Application.Features.Job.JobRoles.Commands.ApproveJobRole;
using CMS.Application.Features.Job.JobRoles.Commands.DeactivateJobRole;
using CMS.Application.Features.Job.JobRoles.Commands.RejectJobRoles;
using CMS.Application.Features.Jobs.Job.Command.ActivateJob;
using CMS.Application.Features.Jobs.Job.Command.ApproveJob;
using CMS.Application.Features.Jobs.Job.Command.CreateJob;
using CMS.Application.Features.Jobs.Job.Command.DeactivateJob;
using CMS.Application.Features.Jobs.Job.Command.RejectJob;
using CMS.Application.Features.Jobs.Job.Command.SubmitJob;
using CMS.Application.Features.Jobs.Job.Command.UpdateJob;
using CMS.Application.Features.Jobs.Job.JobCreationCustomResponse;
using CMS.Application.Features.Jobs.Job.JobUpdationCustomResponse;
using CMS.Application.Features.Jobs.Job.Model;
using CMS.Application.Features.Jobs.Job.Query;
using CMS.Application.Features.Jobs.Job.Query.JobSearchWithBusinessUinitAndJobRole;
using CMS.Application.Features.Jobs.JobCatagories;
using CMS.Application.Features.Jobs.JobGrades;
using CMS.Application.Features.Jobs.JobRoles.Commands.ActivateJobRole;
using CMS.Application.Features.Jobs.JobRoles.Commands.CreateJobRole;
using CMS.Application.Features.Jobs.JobRoles.Commands.SubmitJobRoles;
using CMS.Application.Features.Jobs.JobRoles.Commands.UpdateJobRole;
using CMS.Application.Features.Jobs.JobRoles.Queries;
using CMS.Application.Features.Jobs.JobRoles;
using CMS.Domain;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;
using SMS.Application;
using CMS.Api.Controllers;
using CMS.Application.Features.Jobs.JobGrades.CreateJobGrade;
using CMS.Application.Features.Jobs.JobGrades.Model;
using Microsoft.AspNetCore.Authorization;
using CMS.Application.Security;
using CMS.API.Attributes;


namespace CMS.API.Controllers.JobController
{

    [Route("api/[controller]")]
    [ApiController]
    public class JobController : BaseController<JobController>
    {


        [HttpPost("AddJobRoles", Name = "AddJobRoles")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddJobRole([FromBody] AddJobRoleCommand command)
        {
            var jobRole = await mediator.Send(command);
            return (jobRole);
        }

        [HttpPut("UpdateJobRole", Name = "UpdateJobRole")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]

        public async Task<ActionResult<int>> UpdateJobRole([FromBody] UpdateJobRoleCommand command)
        {
            var updatedId = await mediator.Send(command);
            return Ok(updatedId);
        }
        [HttpPut("SubmitJobRoles", Name = "SubmitJobRoles")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitJobRoles([FromBody] SubmitJobRolesCommand command)
        {
            var SubmittedId = await mediator.Send(command);
            return Ok(SubmittedId);
        }
        [HttpPut("ApproveJobRole", Name = "ApproveJobRole")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveJobRole([FromBody] ApproveJobRolesCommand command)
        {
            var approvedJobRole = await mediator.Send(command);
            return Ok(approvedJobRole);
        }
        [HttpPut("RejectJobRole", Name = "RejectJobRole")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectJobRole([FromBody] RejectJobRolesCommand command)
        {
            var rejectedId = await mediator.Send(command);
            return Ok(rejectedId);
        }
        [HttpPut("Deactivate", Name = "Deactivate")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canDeactivateSetup)]
        public async Task<ActionResult<int>> DeactivateJobRole([FromBody] DeactivateJobRoleCommand command)
        {
            var InActiveJobRole = await mediator.Send(command);
            return InActiveJobRole;
        }
        [HttpPut("Activate", Name = "Activate")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canActivateSetup)]
        public async Task<ActionResult<int>> ActivateJobRole([FromBody] ActivateJobRoleCommand command)
        {
            var ActiveJobRole = await mediator.Send(command);
            return ActiveJobRole;
        }
        [HttpGet("GetJobRoleById", Name = "GetJoleByID")]
        [ProducesResponseType(200)]
        [Authorize(Policy =AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<int>> GetJobRoleByID(int id)
        {
            var jobRole = await mediator.Send(new GetJobRoleByIdQuery(id));
            return Ok(jobRole);
        }
        [HttpGet("allJobRoles", Name = "GetAllJobRoles")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobRolesSearchResult>> GetJobRolesLists(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetJobRolesListQuery(status, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("counts", Name = "GetJobRolesCountPerApprovalStatus")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<JobRolesCountsByStatus> GetJobRolesCountPerApprovalStatus()
        {
            return await mediator.Send(new GetJobRolesCountPerApprovalStatusQuery());
        }

        [HttpGet("allJobRole", Name = "GetAllJobRole")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<JobRoleDto>>> GetAllJobRole()
        {
            var searchResult = await mediator.Send(new GetJobRoleQuery());
            return searchResult;
        }

        [HttpGet("AllJobList", Name = "GetAllJobList")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<JobDto>>> GetAllJobList()
        {
            var jobList = await mediator.Send(new GetAllJobQuery());
            return jobList;
        }

        [HttpGet("GetJobByBUId", Name = "GetJobByBUId")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<JobDto>>> GetJobByBUId(int id,int employeeId)
        {
            var job = await mediator.Send(new GetJobByBusinessUnitIDQuery(id,employeeId));
            return Ok(job);
        }


        [HttpGet("JobCountsBystatus", Name = "GetJobCountPerStatusQuery")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<JobCountsByStatus> GetJobCountPerStatus()
        {
            return await mediator.Send(new GetJobCountPerStatusQuery());
        }

        [HttpGet("GetJobListByBusinessUnitAndJobRole", Name = "GetJobListByBusinessUnitAndJobRoleQuery")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobSearchResultByBusinessUnitAndJobRole>> GetJobListByBusinessUnitAndJobRole
                    (
                    [FromQuery] int? businessUnit,
                    [FromQuery] int? jobRole,
                    int PageNumber,
                    int PageSize
                    )
        {
            var query = new GetJobListByBusinessUnitAndJobRoleQuery(businessUnit, jobRole, PageNumber, PageSize);
            var jobSearchResult = await mediator.Send(query);
            if (jobSearchResult.Items == null || jobSearchResult.Items.Count == 0)
            {
                return Ok(new JobSearchResultByBusinessUnitAndJobRole(new List<JobDto>(), 0));
            }
            return Ok(jobSearchResult);
        }
        [HttpGet("GetJobForPagination", Name = "GetJobsForPagination")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<JobSearchResult> GetJobForPagination(ApprovalStatus Status, int PageNumber, int PageSize)
        {
            return await mediator.Send(new GetJobListForPaginationQuery(Status, PageNumber, PageSize));

        }

        [HttpPost("AddJob", Name = "AddJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<JobCreationResponse>> AddJob([FromBody] AddJobCommand command)
        {
            var addJob = await mediator.Send(command);
            return addJob;
        }

        [HttpPut("UpdateJob", Name = "UpdateJob")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<JobUpdationResponse>> UpdateJob([FromBody] UpdateJobCommand command)
        {
            var updateJob = await mediator.Send(command);
            return updateJob;
        }

        [HttpPost("SubmitJob", Name = "SubmitJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>> SubmitJob([FromBody] SubmitJobCommand command)
        {
            var submitJob = await mediator.Send(command);
            return submitJob.JobId;
        }

        [HttpPost("ApproveJob", Name = "ApproveJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> ApproveJob([FromBody] ApproveJobCommand command)
        {
            var approveJob = await mediator.Send(command);
            return approveJob.JobId;
        }
        [HttpPost("RejectJob", Name = "RejectJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>> RejectJob([FromBody] RejectJobCommand command)
        {
            var rejectJob = await mediator.Send(command);
            return rejectJob;
        }
        [HttpPost("DeactivateJob", Name = "DeactivateJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canDeactivateSetup)]
        public async Task<ActionResult<int>> DeactivateJob([FromBody] DeactivateJobCommand command)
        {
            var deactivateJob = await mediator.Send(command);
            return deactivateJob;
        }
        [HttpPost("ActivateJob", Name = "ActivateJob")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canActivateSetup)]
        public async Task<ActionResult<int>> ActivateJob([FromBody] ActivateJobCommand command)
        {
            var activateJob = await mediator.Send(command);
            return activateJob;
        }

    }
}
