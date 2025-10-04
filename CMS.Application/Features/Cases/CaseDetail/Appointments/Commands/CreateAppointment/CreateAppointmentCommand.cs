using AutoMapper;
using CMS.Domain.Appointments;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.CreateAppointment
{
    public class CreateAppointmentCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public int BusinessUnitId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? ScheduledById { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public CreateAppointmentCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Appointment>(request);
            entity.Status = Domain.Enum.AppointmentStatus.Scheduled;

            await _dataService.Appointments.AddAsync(entity, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return entity.Id;
        }
    }
}
