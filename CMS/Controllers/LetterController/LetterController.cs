using CMS.API.Controllers;
using CMS.Application.Features.Commands.CreateLetter;
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

        // Additional endpoints for updating, forwarding, archiving letters, etc.
    }
}

