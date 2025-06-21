using CMS.Api.Controllers;
using CMS.API.Attributes;
using CMS.Application.Features.Addresses.Commands.CreateAddress;
using CMS.Application.Features.Addresses.Commands.UpdateAddress;
using CMS.Application.Security;
using CMS.Domain.Adress;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.AddressController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : BaseController<AddressController>
    {


        [HttpPost("create", Name = "CreateAddress")]
        [InvalidateQueryTags("EmployeeProfile", "BusinessUnit")]
        [Authorize(Policy =AuthPolicy.AddressAndContact.canCreateUpdateAddressAndContact)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateAddress([FromBody] CreateAddressCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetAddressbyId")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AddressDto>> GetAddressByRequestId(int RequestId, AddressTypeEnum addressType)
        {
            return Ok(await mediator.Send(new GetAddressesQuery(RequestId, addressType)));
        }
        [HttpPut("update", Name = "UpdateAddressByRequestId")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canCreateUpdateAddressAndContact)]
        public async Task<ActionResult<int>> UpdateAddressByRequestId(UpdateAddressCommand command)
        {
            return Ok(await mediator.Send(command));
        }
        [HttpGet("GetEmployeeFamilyAddressById",Name = "GetEmployeeFamilyAddressById")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<List<AddressDto>>> GetEmployeeFamilyAddressById(int addressId)
        {
            var Address = await mediator.Send(new GetAddressQueryById(addressId));
            return Address;
        }

        [HttpGet("GetGuaranterAddressQuery", Name = "GetGuaranterAddressQuery")]
        [Authorize(Policy = AuthPolicy.AddressAndContact.canViewAddressAndContact)]
        public async Task<ActionResult<List<AddressDto>>> GetGuaranterAddress(int employeeId)
        {
            var Address = await mediator.Send(new GetGuaranterAddressQuery(employeeId));
            return Address;

        }
    }
}
