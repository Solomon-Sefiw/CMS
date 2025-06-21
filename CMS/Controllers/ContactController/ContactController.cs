using Azure.Core;
using CMS.Api.Controllers;
using CMS.API.Attributes;
using CMS.Application.Features.Commands.CreateContact;
using CMS.Application.Features.Commands.UpdateContact;
using CMS.Application.Features.Models;
using CMS.Application.Features.Queries;
using CMS.Application.Security;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.ContactController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : BaseController<ContactController>
    {

        [HttpPost("Create", Name = "CreateContact")]
        [InvalidateQueryTags("EmployeeProfile", "BusinessUnit")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canCreateUpdateAddressAndContact)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateContact([FromBody] CreateContactCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetContactByRequestId")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<ContactDto>> GetContactByRequestId(int RequestId, ContactCategoryEnum contactCategory, ContactTypeEnum type)
        {
            return Ok(await mediator.Send(new GetContactByRequestIdQuery(RequestId, contactCategory, type)));
        }
        [HttpPut("update", Name = "UpdateContactByRequestId")]
        [InvalidateQueryTags("EmployeeProfile", "BusinessUnit")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canCreateUpdateAddressAndContact)]
        public async Task<ActionResult<int>> UpdateContactByRequestId(UpdateContactCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpGet("contacts", Name = "GetContactsById")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<IActionResult> GetContactsById(int RequestId,ContactCategoryEnum contactCategory)
        {
            return Ok(await mediator.Send(new GetContactsByRequestIdQuery(RequestId, contactCategory)));
        }
        //GetContactsByEntityTypeQuery
        [HttpGet("GetContactsByEntity")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<List<ContactDto>>> GetContactsByEntity(int EmployeeId)
        {
            var contact = await mediator.Send(new GetContactsByEntityTypeQuery(EmployeeId));
            return contact;
        }
        //GetEmployeeFamilyContactByRequestIdQuery
        [HttpGet("GetEmployeeFamilyContact")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<ContactDto>> GetEmployeeFamilyContactById(int contactId, ContactCategoryEnum contactCategory)
        {
            var contact = await mediator.Send(new GetEmployeeFamilyContactByRequestIdQuery(contactId, contactCategory));
            return contact;
        }
        //GetContactOfGuaraterWorkingFirmQuery
        [HttpGet("GetContactOfGuarater")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<List<ContactDto>>> GetContactOfGuarater(int contactId)
        {
            var contact = await mediator.Send(new GetContactOfGuaraterQuery(contactId));
            return contact;
        }
        [HttpGet("GetContactOfGuaraterWorkingFirm")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<List<ContactDto>>> GetContactOfGuaraterWorkingFirm(int contactId)
        {
            var contact = await mediator.Send(new GetContactOfGuaraterWorkingFirmQuery(contactId));
            return contact;
        }
    }
}
