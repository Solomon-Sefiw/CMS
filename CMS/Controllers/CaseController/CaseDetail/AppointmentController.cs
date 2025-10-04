using CMS.API.Controllers;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.CreateAppointment;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.UpdateAppointment;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Models;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Api.Controllers.CaseController.CaseDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : BaseController<AppointmentController>
    {
        [HttpPost("Create", Name = "CreateAppointment")]
        public async Task<ActionResult<int>> CreateAppointment([FromBody] CreateAppointmentCommand command)
            => Ok(await mediator.Send(command));

        [HttpPut("Update", Name = "UpdateAppointment")]
        public async Task<ActionResult<bool>> UpdateAppointment(int id, [FromBody] UpdateAppointmentCommand command)
        {
            if (id != command.Id) return BadRequest("Id mismatch.");
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetById", Name = "GetAppointmentById")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentById(int id)
            => Ok(await mediator.Send(new GetAppointmentByIdQuery(id)));

        [HttpGet("GetByCaseId", Name = "GetAppointmentsByCaseId")]
        public async Task<ActionResult<List<AppointmentDto>>> GetAppointmentsByCaseId(int caseId)
            => Ok(await mediator.Send(new GetAppointmentsByCaseIdQuery(caseId)));

        [HttpGet("GetByBusinessUnitId", Name = "GetAppointmentsByBusinessUnitId")]
        public async Task<ActionResult<List<AppointmentDto>>> GetAppointmentsByBusinessUnitId(int businessUnitId)
            => Ok(await mediator.Send(new GetAppointmentsByBusinessUnitIdQuery(businessUnitId)));

        [HttpGet("GetAll", Name = "GetAllAppointments")]
        public async Task<ActionResult<List<AppointmentDto>>> GetAllAppointments()
            => Ok(await mediator.Send(new GetAllAppointmentsQuery()));
    }
}
