using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Archives.Commands.CreateDocketEntry;
using CMS.Application.Features.Cases.CaseDetail.Archives.Commands.UpdateDocketEntry;
using CMS.Application.Features.Cases.CaseDetail.Archives.Models;
using CMS.Application.Features.Cases.CaseDetail.Archives.Queries;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocketEntryController : BaseController<DocketEntryController>
    {
        [HttpPost("Create", Name = "CreateDocketEntry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreateDocketEntry([FromBody] CreateDocketEntryCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateDocketEntry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> UpdateDocketEntry(int id, [FromBody] UpdateDocketEntryCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetDocketById", Name = "GetDocketEntryById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DocketEntryDto>> GetDocketEntryById(int id)
            => Ok(await mediator.Send(new GetDocketEntryByIdQuery(id)));

        [HttpGet("GetByCaseId", Name = "GetDocketEntriesByCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<DocketEntryDto>>> GetDocketEntriesByCaseId(int caseId)
            => Ok(await mediator.Send(new GetDocketEntriesByCaseIdQuery(caseId)));

        [HttpGet("GetAll", Name = "GetAllDocketEntries")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<DocketEntryDto>>> GetAllDocketEntries()
            => Ok(await mediator.Send(new GetAllDocketEntriesQuery()));
    }
}
