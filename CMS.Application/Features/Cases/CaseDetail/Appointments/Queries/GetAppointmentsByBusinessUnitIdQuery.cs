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
    public record GetAppointmentsByBusinessUnitIdQuery(int BusinessUnitId) : IRequest<List<AppointmentDto>>;

    public class GetAppointmentsByBusinessUnitIdQueryHandler : IRequestHandler<GetAppointmentsByBusinessUnitIdQuery, List<AppointmentDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetAppointmentsByBusinessUnitIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<AppointmentDto>> Handle(GetAppointmentsByBusinessUnitIdQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.Appointments
                .Where(a => a.BusinessUnitId == request.BusinessUnitId)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<AppointmentDto>>(list);
        }
    }
}
