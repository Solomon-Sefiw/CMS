using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Query;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeFileDocumentsController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditEmployeeFileDocumentController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuditEmployeeFileDocumentController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        [Route("getAuditEmployeeFileDocumentLogs", Name = "getAuditEmployeeFileDocumentLogs")]
        public async Task<IActionResult> GetAuditEmployeeFileDocumentLogs()
        {
            var query = new GetAuditEmployeeFileDocumentLogs();
            var logs = await _mediator.Send(query);
            return Ok(logs);
        }
        [HttpGet("getAuditEmployeeDocumentFileByEmployeeId/{employeeId:int}")]
        [ProducesResponseType(typeof(List<AuditEmployeeFileDocumentDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<AuditEmployeeFileDocumentDto>> GetAuditEmployeeDocumentFileByEmployeeId(int employeeId)
        {
            var query = new GetAuditEmployeeDocumentFileByEmployeeIdQuery { EmployeeId = employeeId };
            var logs = await _mediator.Send(query);
            return Ok(logs);
        }
    }
}
