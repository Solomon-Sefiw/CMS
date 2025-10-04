using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.CreateJudgeAssignment;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.UpdateJudgeAssignment;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Queries;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class JudgeAssignmentController : BaseController<JudgeAssignmentController>
    {
        [HttpPost("Create", Name = "CreateJudgeAssignment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreateJudgeAssignment([FromBody] CreateJudgeAssignmentCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateJudgeAssignment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> UpdateJudgeAssignment(int id, [FromBody] UpdateJudgeAssignmentCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetByCaseId", Name = "GetJudgeAssignmentsByCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<JudgeAssignmentDto>>> GetJudgeAssignmentsByCaseId(int caseId)
        {
            return await mediator.Send(new GetJudgeAssignmentsByCaseIdQuery(caseId));
        }
    }
}
