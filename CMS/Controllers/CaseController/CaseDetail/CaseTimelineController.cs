using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.CreateCaseTimeline;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.UpdateCaseTimeline;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Models;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseTimelineController : BaseController<CaseTimelineController>
    {
        [HttpPost("Create", Name = "CreateCaseTimeline")]
        public async Task<ActionResult<int>> CreateCaseTimeline([FromBody] CreateCaseTimelineCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateCaseTimeline")]
        public async Task<ActionResult<bool>> UpdateCaseTimeline(int id, [FromBody] UpdateCaseTimelineCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetTimelineById", Name = "GetCaseTimelineById")]
        public async Task<ActionResult<CaseTimelineDto>> GetCaseTimelineById(int id)
            => Ok(await mediator.Send(new GetCaseTimelineByIdQuery(id)));

        [HttpGet("GetByCaseId", Name = "GetCaseTimelinesByCaseId")]
        public async Task<ActionResult<List<CaseTimelineDto>>> GetCaseTimelinesByCaseId(int caseId)
            => Ok(await mediator.Send(new GetCaseTimelinesByCaseIdQuery(caseId)));

        [HttpGet("GetAll", Name = "GetAllCaseTimelines")]
        public async Task<ActionResult<List<CaseTimelineDto>>> GetAllCaseTimelines()
            => Ok(await mediator.Send(new GetAllCaseTimelinesQuery()));
    }
}
