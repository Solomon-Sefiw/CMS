using CMS.API.Attributes;
using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.CreateChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.UpdateChilot;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Queries;
using CMS.Application.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChilotController : BaseController<ChilotController>
    {
        [HttpPost("create", Name = "CreateChilot")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateChilot([FromBody] CreateChilotCommand command)
          => Ok(await mediator.Send(command));

        [HttpPut("update", Name = "UpdateChilot")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateChilot( [FromBody] UpdateChilotCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("by-business/{businessUnitId}")]
        public async Task<List<ChilotDto>> GetChilotByBusinessUnit(int businessUnitId)
            => await mediator.Send(new GetChilotsByBusinessUnitIdQuery(businessUnitId));

        [HttpGet("allChilot")]
        public async Task<List<ChilotDto>> GetAllChilot()
    => await mediator.Send(new GetAllChilotQuery());

    }
}
