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
    public record GetAppointmentsByCaseIdQuery(int CaseId) : IRequest<List<AppointmentDto>>;

    public class GetAppointmentsByCaseIdQueryHandler : IRequestHandler<GetAppointmentsByCaseIdQuery, List<AppointmentDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetAppointmentsByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<AppointmentDto>> Handle(GetAppointmentsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.Appointments
                .Where(a => a.CaseId == request.CaseId)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<AppointmentDto>>(list);
        }
    }
}
