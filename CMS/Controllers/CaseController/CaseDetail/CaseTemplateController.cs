using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.CreateCaseTemplate;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.UpdateCaseTemplate;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Models;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Queries;

using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseTemplateController : BaseController<CaseTemplateController>
    {
        [HttpPost("Create", Name = "CreateCaseTemplate")]
        public async Task<ActionResult<int>> CreateCaseTemplate([FromBody] CreateCaseTemplateCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateCaseTemplate")]
        public async Task<ActionResult<bool>> UpdateCaseTemplate(int id, [FromBody] UpdateCaseTemplateCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetById", Name = "GetCaseTemplateById")]
        public async Task<ActionResult<CaseTemplateDto>> GetCaseTemplateById(int id)
            => Ok(await mediator.Send(new GetCaseTemplateByIdQuery(id)));

        [HttpGet("GetAll", Name = "GetAllCaseTemplates")]
        public async Task<ActionResult<List<CaseTemplateDto>>> GetAllCaseTemplates()
            => Ok(await mediator.Send(new GetAllCaseTemplatesQuery()));
    }
}
