using CMS.API.Controllers;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Features.Letter.Queries;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.LetterController
{
    [Route("api/[controller]")]
    [ApiController]
    public class LetterController : BaseController<LetterController>
    {
        [HttpPost]
        public async Task<ActionResult<int>> CreateLetter(CreateLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return letterId;
        }
        [HttpPut("{id}")] // Use {id} in the route for PUT
        public async Task<IActionResult> UpdateLetter(int id, [FromBody] UpdateLetterCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL does not match ID in request body.");
            }

            await mediator.Send(command);
            return NoContent(); // 204 No Content is typical for successful updates that don't return data
        }

        // Additional endpoints for updating, forwarding, archiving letters, etc.
        [HttpGet]
        public async Task<ActionResult<PaginatedList<LetterDto>>> GetAllLetters( LetterStatus status, int pageNumber = 1, int pageSize = 10,
                                                                                 string? searchTerm = null, string? sortBy = null, bool sortAscending = true)
        {
            var query = new GetLetterListForPaginationQuery(status, pageNumber, pageSize, searchTerm, sortBy, sortAscending);
            var result = await mediator.Send(query);
            return Ok(result);
        }
        [HttpGet("search-all")]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLetters()
        {
            var query = new SearchLettersQuery();
            var result = await mediator.Send(query);
            return Ok(result);
        }
    }
}

