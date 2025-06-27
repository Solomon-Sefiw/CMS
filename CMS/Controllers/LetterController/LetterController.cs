using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application.Features.Addresses.Setups.SubCity.Queiries;
using CMS.Application.Features.BusinessUnits.Commands.ApproveBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.RejectBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.SubmitBusinessUnit;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Employees.Commands.Documents;
using CMS.Application.Features.Letter.Commands.ApproveLetter;
using CMS.Application.Features.Letter.Commands.RejectLetter;
using CMS.Application.Features.Letter.Commands.SubmitLetter;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Features.Letter.Queries;
using CMS.Application.Security;
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
        [HttpPut] // Use {id} in the route for PUT
        public async Task<IActionResult> UpdateLetter(UpdateLetterCommand command)
        {

            await mediator.Send(command);
            return NoContent(); // 204 No Content is typical for successful updates that don't return data
        }
        [HttpGet("count", Name = "GetLetterCountPerStatus")]
        [ProducesResponseType(200)]
        public async Task<LetterCountsByStatus> GetLetterCountPerStatus(string userId)
        {
            return await mediator.Send(new GetLetterCountPerStatusQuery(userId));
        }

        [HttpGet("GetLettersForPagination", Name = "GetLettersForPagination")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PaginatedLetterList>> GetLettersForPagination(LetterStatus status, int pageNumber, int pageSize,string userId)
        {
            var searchResult = await mediator.Send(new GetPaginatedLettersQuery(status, userId, pageNumber, pageSize));

            return searchResult;
        }
        [HttpGet("search-all")]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLetters(string userId)
        {
            var query = new SearchLettersQuery(userId);
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpPatch("submit", Name = "SubmitLetter")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> SubmitLetter([FromBody] SubmitLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }


        [HttpPatch("approve", Name = "ApproveLetter")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ApproveLetter([FromBody] ApproveLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }


        [HttpPatch("Reject", Name = "RejectLetter")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectLetter([FromBody] RejectLetterCommand command)
        {
            var letterId = await mediator.Send(command);
            return Ok(letterId);
        }


    }
}

