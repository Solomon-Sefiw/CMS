using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Payments.Commands.CreatePayment;
using CMS.Application.Features.Cases.CaseDetail.Payments.Commands.UpdatePayment;
using CMS.Application.Features.Cases.CaseDetail.Payments.Models;
using CMS.Application.Features.Cases.CaseDetail.Payments.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : BaseController<PaymentController>
    {
        [HttpPost("Create", Name = "CreatePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CreatePayment([FromBody] CreatePaymentCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdatePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> UpdatePayment(int id, [FromBody] UpdatePaymentCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetById", Name = "GetPaymentById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PaymentDto>> GetPaymentById(int id)
            => Ok(await mediator.Send(new GetPaymentByIdQuery(id)));

        [HttpGet("GetByCaseId", Name = "GetPaymentsByCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<PaymentDto>>> GetPaymentsByCaseId(int caseId)
            => Ok(await mediator.Send(new GetPaymentsByCaseIdQuery(caseId)));

        [HttpGet("GetByBusinessUnit", Name = "GetPaymentsByBusinessUnit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<PaymentDto>>> GetPaymentsByBusinessUnit(int businessUnitId)
            => Ok(await mediator.Send(new GetPaymentsByBusinessUnitQuery(businessUnitId)));

        [HttpGet("GetAll", Name = "GetAllPayments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<PaymentDto>>> GetAllPayments()
            => Ok(await mediator.Send(new GetPaymentsByCaseIdQuery(0))); // placeholder - replace with a proper GetAll query if desired
    }
}