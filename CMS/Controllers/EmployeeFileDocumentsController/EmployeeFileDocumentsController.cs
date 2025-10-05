
using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.Commands;
using CMS.Application.Features.EmployeeFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.Queries;

using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.EmployeeFileDocumentsController
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeFileDocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFileService _fileService;
        private readonly ILogger<GetEmployeeFileDocumentByIdHandler> _logger;
    public EmployeeFileDocumentsController(IMediator mediator, IFileService fileService, ILogger<GetEmployeeFileDocumentByIdHandler> logger)
        {
            _mediator = mediator;
            _fileService = fileService;
            _logger = logger;
        }

        [HttpPost("UploadEmployeeFileDocument", Name = "UploadEmployeeFileDocument")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Guid>> UploadEmployeeFileDocument(
    [FromForm] UploadEmployeeFileDocumentCommand command)
        {
            if (command.File == null || command.File.Length == 0)
                return BadRequest("A valid file must be uploaded.");

            var documentId = await _mediator.Send(command);
            return Ok(new  { DocumentId = documentId });
        }

        [HttpPut("updateEmployeeFileDocument")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
     public async Task<ActionResult<string>> UpdateEmployeeFileDocument(
     [FromForm] UpdateEmployeeFileDocumentCommand command)
        {
            if (command.File != null && command.File.Length == 0)
                return BadRequest("A valid file must be uploaded.");

            var result = await _mediator.Send(command);
            if (!result)
                return NotFound("Document not found.");

            return Ok(new { message = "Updated successfully" });
        }

              
        [HttpGet("get/{id:guid}", Name = "getEmployeeFileById")]
        [ProducesResponseType(typeof(EmployeeFileDocumentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var query = new GetEmployeeFileDocumentByIdQuery { Id = id };
            var document = await _mediator.Send(query);
            if (document == null)
                return NotFound("Document not found.");

            return Ok(document);
        }

        [HttpGet("getDocumentByEmployeeId/{employeeId:int}", Name = "getEmployeeFilesByEmployeeId")]
        [ProducesResponseType(typeof(List<EmployeeFileDocumentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetEmployeeFileDocumentByEmployeeId(int employeeId, int ResignationId, int SuspensionId)
        {
            var query = new GetEmployeeFileDocumentsByEmployeeIdQuery { EmployeeId = employeeId,ResignationId = ResignationId, SuspensionId = SuspensionId };
            var documents = await _mediator.Send(query);
            return Ok(documents);
        }

        [HttpGet("DownloadEmployeeFileDocument/{id:guid}", Name = "DownloadEmployeeFileDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadEmployeeFileDocument(Guid id)
        {
            var document = await _mediator.Send(new GetEmployeeFileDocumentByIdQuery { Id = id });
            if (document == null)
            {
                _logger.LogWarning("Document with ID {Id} not found", id);
                return NotFound();
            }

            var fileBytes = await _fileService.ReadFileAsync(document.FilePath);
            if (fileBytes == null || fileBytes.Length == 0)
            {
                _logger.LogWarning("File not found on disk: {FilePath}", document.FilePath);
                return NotFound();
            }

            return File(fileBytes, document.ContentType, document.FileName);
        }

    }
}
