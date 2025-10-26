using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application.EmployeeFile;
using CMS.Application.Features.Cases.CaseFileDocument.Queries;
using CMS.Application.Features.Letter.Commands.ApproveLetter;
using CMS.Application.Features.Letter.Commands.CreateLetter;
using CMS.Application.Features.Letter.Commands.CreateLetter.CMS.Application.Features.Letter.Commands;
using CMS.Application.Features.Letter.Commands.Documents;
using CMS.Application.Features.Letter.Commands.RejectLetter;
using CMS.Application.Features.Letter.Commands.SubmitLetter;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.LetterController
{
    [Route("api/[controller]")]
    [ApiController]
    public class LetterController : BaseController<LetterController>
    {
        private readonly IFileService _fileService;
        private readonly ILogger<GetCaseFileDocumentByIdHandler> _logger;
        public LetterController(IFileService fileService, ILogger<GetCaseFileDocumentByIdHandler> logger)
        {
            _fileService = fileService;
            _logger = logger;
        }
        [HttpPost]
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        public async Task<ActionResult<int>> CreateLetter(CreateLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        public async Task<IActionResult> UpdateLetter(int id, UpdateLetterCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID mismatch");
            }
            await mediator.Send(command);
            return NoContent();
        }

        [HttpGet("count")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        [ProducesResponseType(200)]
        public async Task<LetterCountsByStatus> GetLetterCountPerStatus(string userId)
        {
            return await mediator.Send(new GetLetterCountPerStatusQuery(userId));
        }

        [HttpGet("GetLettersForPagination")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedLetterList>> GetLettersForPagination(LetterStatus status, int pageNumber, int pageSize, string userId)
        {
            var searchResult = await mediator.Send(new GetPaginatedLettersQuery(status, userId, pageNumber, pageSize));
            return Ok(searchResult);
        }

        [HttpGet("search-all")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLetters(string userId)
        {
            var query = new SearchLettersQuery(userId);
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpPatch("submit")]
        [Authorize(Policy = AuthPolicy.Letter.canSubmitLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitLetter([FromBody] SubmitLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }

        [HttpPatch("approve")]
        [Authorize(Policy = AuthPolicy.Letter.canApproveRejectLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveLetter([FromBody] ApproveLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }

        [HttpPatch("Reject")]
        [Authorize(Policy = AuthPolicy.Letter.canApproveRejectLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectLetter([FromBody] RejectLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }

        //[HttpPost("{id}/add-Document")]
        //[Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        //[ProducesResponseType(200)]
        //public async Task<DocumentMetadataDto> AddLetterDocument(int id, DocumentType documentType, [FromForm] UploadDocumentDto document)
        //{
        //    var command = new AddLetterDocumentCommand(id, documentType, document.File);
        //    var doc = await mediator.Send(command);
        //    return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        //}


        // =============================================
        // Upload Letter Document
        // =============================================
        [HttpPost("UploadLetterDocument", Name = "UploadLetterDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadLetterDocument([FromForm] UploadLetterDocumentCommand command)
        {
            if (command.File == null)
                return BadRequest("File is required.");

            var result = await mediator.Send(command);
            return Ok(new { DocumentId = result, Message = "Letter document uploaded successfully." });
        }

        // =============================================
        // Update Letter Document
        // =============================================
        [HttpPut("UpdateLetterDocument", Name = "UpdateLetterDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateLetterDocument([FromForm] UpdateLetterDocumentCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(new { DocumentId = result, Message = "Letter document updated successfully." });
        }

        // =============================================
        // Get Letter Document by LetterId
        // =============================================
        [HttpGet("GetLetterDocument/{letterId:int}", Name = "GetLetterDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLetterDocument(int letterId)
        {
            var result = await mediator.Send(new GetLetterDocumentByLetterIdQuery
            {
                LetterId = letterId
            });

            if (result == null)
                return NotFound("No document found for this letter.");

            return Ok(result);
        }

        // =============================================
        // View/Download Letter Document
        // =============================================
        [HttpGet("View/{letterId:int}", Name = "ViewLetterDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ViewLetterDocument(int letterId)
        {
            var document = await mediator.Send(new GetLetterDocumentByLetterIdQuery
            {
                LetterId = letterId
            });

            if (document == null)
                return NotFound("No document found for this letter.");

            if (string.IsNullOrEmpty(document.FullPhysicalPath) || !System.IO.File.Exists(document.FullPhysicalPath))
                return NotFound("Document file not found on the server.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(document.FullPhysicalPath);
            return File(fileBytes, document.ContentType ?? "application/octet-stream", document.FileName);
        }

        [HttpGet("DownloadLetterDocument/{id:guid}", Name = "DownloadLetterDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadLetterDocument(Guid id)
        {
            var document = await mediator.Send(new GetLetterDocumentByIdQuery { Id = id });
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

            return File(fileBytes, document.ContentType ?? "application/octet-stream", document.FileName);
        }

        [HttpPost("editable")]
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        public async Task<ActionResult<int>> CreateEditableLetter(CreateEditableLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }
    }
}