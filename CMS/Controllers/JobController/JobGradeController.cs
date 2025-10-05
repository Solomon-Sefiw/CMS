using CMS.API.Controllers;
using CMS.Application.Features.Jobs.JobGrades;
using CMS.Application.Features.Jobs.JobGrades.CreateJobGrade;
using CMS.Application.Features.Jobs.JobGrades.Model;
using CMS.Application.Features.Jobs.JobGrades.UpdateJobGrade;
using CMS.Application.Features.Jobs.JobRoles.Queries;
using CMS.Application.Features.Jobs.JobRoles;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SMS.Application;
using CMS.Domain;
using CMS.Application.Features.Job.JobGrades.Commands.ApproveGrade;
using CMS.Application.Features.Job.JobGrades.Commands.RejectJobGrade;
using CMS.Application.Features.Job.JobGrades.Commands.SubmitJobGrade;
using CMS.Application.Security;
using Microsoft.AspNetCore.Authorization;
using CMS.API.Attributes;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionQuery;

namespace CMS.Api.Controllers.JobController
{
        [Route("api/[controller]")]
        [ApiController]
        public class JobGradeController : BaseController<JobGradeController> {

        [HttpPost("AddJobGrade",Name ="AddJobGrade")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<ActionResult<int>> AddJobGrade([FromBody]AddJobGradeCommand request)
        {
            var JobGradeId = await mediator.Send(request);
            return Ok(JobGradeId);
        }
        [HttpPut("UpdateJobGrade",Name ="UpdateJobGrade")]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canCreateUpdateSetup)]
        public async Task<IActionResult> UpdateJobGrade(UpdateJobGradeCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result); // Instead of returning Task<ActionResult<int>>
        }

        [HttpGet("allJobGrades", Name = "GetAllJobGrade")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<List<JobGrade>>> GetAllJobGrade()
        {
            var searchResult = await mediator.Send(new GetJobGradeQuery());
            return searchResult;
        }

     
        [HttpGet("GetJobGradesList", Name = "GetJobGradesList")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<ActionResult<JobGradesSearchResult>> GetJobGradesList(ApprovalStatus status, int pageNumber, int pageSize)
        {
            var searchResult = await mediator.Send(new GetJobGradesListQuery(status, pageNumber, pageSize));

            return searchResult;
        }
      

        [HttpGet("counts", Name = "GetJobGradesCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canViewSetup)]
        public async Task<JobGradesCountsByStatus> GetJobGradesCountPerApprovalStatus()
        {
            return await mediator.Send(new GetJobGradesCountPerApprovalStatusQuery());
        }
        [HttpPut("ApproveJobGrade",Name ="ApproveJobGrade")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>>ApproveJobGrade(ApproveJobGradeCommand command)
        {
            var Approved = await mediator.Send(command);

            return Ok(Approved);
        }
        [HttpPut("RejectJobGrade",Name ="RejectJobGrade")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canApproveRejectSetup)]
        public async Task<ActionResult<int>>RejectJobGrade(RejectJobGradeCommand command)
        {
            var rejected=await mediator.Send(command);
            return Ok(rejected);
        }
        [HttpPut("SubmitJobGrade",Name ="SubmitJobGrade")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Setup.canSubmitSetup)]
        public async Task<ActionResult<int>>SubmitJobGrade(SubmitJobGradeCommand command)
        {
            var Submitted = await mediator.Send(command);
            return Ok(Submitted);
        }
        [HttpGet("GetSalaryOfEmployeeByRole",Name = "GetSalaryOfEmployeeByRole")]
        public async Task<ActionResult<Decimal>> GetSalaryOfEmployeeByRole(int? gradeId, int? salarytype, int? step, int? stepId)
        {
            var salary = await mediator.Send(new GetSalaryOfJobGradeQuey(gradeId,salarytype,step,stepId));
            return salary;
        }
        //GetJobGradeOfJobRoleQuery
        [HttpGet("GetJobGradeOfJobRole", Name = "GetJobGradeOfJobRole")]
        public async Task<ActionResult<JobRole>> GetJobGradeOfJobRole(int roleid)
        {
            var roleInfo = await mediator.Send(new GetJobGradeOfJobRoleQuery(roleid));
            return roleInfo;
        }
    }
}
