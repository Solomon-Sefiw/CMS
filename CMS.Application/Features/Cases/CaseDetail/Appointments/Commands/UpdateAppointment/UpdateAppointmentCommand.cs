using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.UpdateAppointment
{
    public class UpdateAppointmentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class UpdateAppointmentCommandHandler : IRequestHandler<UpdateAppointmentCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public UpdateAppointmentCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            _mapper.Map(request, entity);

            _dataService.Appointments.Update(entity);
            await _dataService.SaveAsync(cancellationToken);

            return true;
        }
    }
}
