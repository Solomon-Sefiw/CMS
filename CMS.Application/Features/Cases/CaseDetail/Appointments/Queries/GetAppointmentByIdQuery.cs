using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Appointments.Queries
{
    public record GetAppointmentByIdQuery(int Id) : IRequest<AppointmentDto?>;

    public class GetAppointmentByIdQueryHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDto?>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetAppointmentByIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<AppointmentDto?> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<AppointmentDto>(entity);
        }
    }
}
