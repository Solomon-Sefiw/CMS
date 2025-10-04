using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.CreateHearing;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.UpdateHearing;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Models;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Queries;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class HearingController : BaseController<HearingController>
    {
        [HttpPost("Create", Name = "CreateHearing")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreateHearing([FromBody] CreateHearingCommand command)
    => Ok(await mediator.Send(command));

        [HttpPut("update", Name = "UpdateHearing")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> UpdateHearing(int id, [FromBody] UpdateHearingCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetHearingByCaseId", Name = "GetHearingByCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<HearingDto>>> GetHearingByCaseId(int caseId)
        {
            return await mediator.Send(new GetHearingsByCaseIdQuery(caseId));
        }

    }
}
