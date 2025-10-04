using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.CreateJudgment;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.UpdateJudgment;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Models;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class JudgmentController : BaseController<JudgmentController>
    {
        [HttpPost("Create", Name = "CreateJudgment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreateJudgment([FromBody] CreateJudgmentCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateJudgment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> UpdateJudgment(int id, [FromBody] UpdateJudgmentCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetByCaseId", Name = "GetJudgmentsByCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<JudgmentDto>>> GetJudgmentsByCaseId(int caseId)
            => await mediator.Send(new GetJudgmentsByCaseIdQuery(caseId));

    }
}
