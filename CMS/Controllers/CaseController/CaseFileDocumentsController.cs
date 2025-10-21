using CMS.Application.EmployeeFile;
using CMS.Application.Features.Cases.CaseFileDocument.Queries;
using CMS.Application.Features.EmployeeFileDocument.Commands;
using CMS.Application.Features.EmployeeFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseFileDocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFileService _fileService;
        private readonly ILogger<GetCaseFileDocumentByIdHandler> _logger;
        public CaseFileDocumentsController(IMediator mediator, IFileService fileService, ILogger<GetCaseFileDocumentByIdHandler> logger)
        {
            _mediator = mediator;
            _fileService = fileService;
            _logger = logger;
        }

        [HttpPost("UploadCaseFileDocument", Name = "UploadCaseFileDocument")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Guid>> UploadCaseFileDocument(
    [FromForm] UploadCaseFileDocumentCommand command)
        {
            if (command.File == null || command.File.Length == 0)
                return BadRequest("A valid file must be uploaded.");

            var documentId = await _mediator.Send(command);
            return Ok(new { DocumentId = documentId });
        }

        [HttpPut("updateCaseFileDocument")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> UpdateCaseFileDocument(
     [FromForm] UpdateCaseFileDocumentCommand command)
        {
            if (command.File != null && command.File.Length == 0)
                return BadRequest("A valid file must be uploaded.");

            var result = await _mediator.Send(command);
            if (!result)
                return NotFound("Document not found.");

            return Ok(new { message = "Updated successfully" });
        }


        [HttpGet("get/{id:guid}", Name = "getCaseFileById")]
        [ProducesResponseType(typeof(CaseFileDocumentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCaseFileById(Guid id)
        {
            var query = new GetCaseFileDocumentByIdQuery { Id = id };
            var document = await _mediator.Send(query);
            if (document == null)
                return NotFound("Document not found.");

            return Ok(document);
        }

        [HttpGet("getDocumentByCaseId/{caseId:int}", Name = "getCaseFilesByCaseId")]
        [ProducesResponseType(typeof(List<CaseFileDocumentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCaseFileDocumentByCaseId(int caseId)
        {
            var query = new GetCaseFileDocumentsByCaseIdQuery { CaseId = caseId};
            var documents = await _mediator.Send(query);
            return Ok(documents);
        }

        [HttpGet("DownloadCaseFileDocument/{id:guid}", Name = "DownloadCaseFileDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadCaseFileDocument(Guid id)
        {
            var document = await _mediator.Send(new GetCaseFileDocumentByIdQuery { Id = id });
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
