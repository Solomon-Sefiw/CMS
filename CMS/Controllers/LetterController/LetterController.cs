using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Letter.Commands.ApproveLetter;
using CMS.Application.Features.Letter.Commands.CreateLetter.CMS.Application.Features.Letter.Commands;
using CMS.Application.Features.Letter.Commands.Documents;
using CMS.Application.Features.Letter.Commands.RejectLetter;
using CMS.Application.Features.Letter.Commands.SubmitLetter;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Models;
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
        [HttpPost]
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        public async Task<ActionResult<int>> CreateLetter(CreateLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return letterId;
        }

        [HttpPut] // Use {id} in the route for PUT
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        public async Task<IActionResult> UpdateLetter(UpdateLetterCommand command)
        {

            await mediator.Send(command);
            return NoContent(); // 204 No Content is typical for successful updates that don't return data
        }
        [HttpGet("count", Name = "GetLetterCountPerStatus")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        [ProducesResponseType(200)]
        public async Task<LetterCountsByStatus> GetLetterCountPerStatus(string userId)
        {
            return await mediator.Send(new GetLetterCountPerStatusQuery(userId));
        }

        [HttpGet("GetLettersForPagination", Name = "GetLettersForPagination")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedLetterList>> GetLettersForPagination(LetterStatus status, int pageNumber, int pageSize,string userId)
        {
            var searchResult = await mediator.Send(new GetPaginatedLettersQuery(status, userId, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("search-all")]
        [Authorize(Policy = AuthPolicy.Letter.canViewLetter)]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLetters(string userId)
        {
            var query = new SearchLettersQuery(userId);
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpPatch("submit", Name = "SubmitLetter")]
        [Authorize(Policy = AuthPolicy.Letter.canSubmitLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitLetter([FromBody] SubmitLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }


        [HttpPatch("approve", Name = "ApproveLetter")]
        [Authorize(Policy = AuthPolicy.Letter.canApproveRejectLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveLetter([FromBody] ApproveLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }


        [HttpPatch("Reject", Name = "RejectLetter")]
        [Authorize(Policy = AuthPolicy.Letter.canApproveRejectLetter)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectLetter([FromBody] RejectLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }

        [HttpPost("{id}/add-Document", Name = "AddLetterDocument")]
        [Authorize(Policy = AuthPolicy.Letter.canCreateUpdateLetter)]
        [ProducesResponseType(200)]
        public async Task<DocumentMetadataDto> AddLetterDocument(int id, DocumentType documentType , [FromForm] UploadDocumentDto document)
        {
            var command = new AddLetterDocumentCommand(id, DocumentType.LetterDocument, document.File);
            var doc = await mediator.Send(command);
            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }

        [HttpPost("editable", Name = "CreateEditableLetter")]
        public async Task<ActionResult<int>> CreateEditableLetter(CreateEditableLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return letterId;
        }

    }
}

