using CMS.API.Attributes;
using CMS.Application.Features.Language.Commands.CreateLanguageSkill;
using CMS.Application.Features.Language.Commands.DeleteLanguageSkill;
using CMS.Application.Features.Language.Commands.UpdateLanguageSkill;
using CMS.Application.Features.Language.Models;
using CMS.Application.Features.Language.Queries;
using CMS.Application.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.Education
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguageSkillController : BaseController<LanguageSkillController>
    {


        [HttpPost("create", Name = "AddLanguageSkill")]
        [InvalidateQueryTags("EmployeeProfile")] // Add this attribute
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateLanguage([FromBody] CreateLanguageSkillCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetLanguageSkillById")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<LanguageSkillDto>>> GetLanguageSkillById(int employeeId)
        {
            return Ok(await mediator.Send(new GetLanguageSkillByIdQuery(employeeId)));
        }
        [HttpPut("update", Name = "UpdateLanguageSkill")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]

        public async Task<ActionResult<int>> UpdateLanguageSkill(UpdateLanguageSkillCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpDelete("delete", Name = "DeleteLanguageSkill")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult> DeleteLanguageSkill(DeleteLanguageSkillCommand command)
        {
            await mediator.Send(command);
            return NoContent(); // Ensure a return value is provided for all code paths
        }

    }
}
