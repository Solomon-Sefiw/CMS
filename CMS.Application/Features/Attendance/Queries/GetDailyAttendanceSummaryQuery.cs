using CMS.Application.Features.Attendance.Interface;
using CMS.Application.Features.Attendance.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Queries
{
    public record GetDailyAttendanceSummaryQuery(DateOnly Date, int? BusinessUnitId) : IRequest<List<DailyAttendanceSummaryDto>>;
    internal class GetDailyAttendanceSummaryQueryHandler : IRequestHandler<GetDailyAttendanceSummaryQuery, List<DailyAttendanceSummaryDto>>
    {
        private readonly IAttendanceService _service;

        public GetDailyAttendanceSummaryQueryHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<List<DailyAttendanceSummaryDto>> Handle(GetDailyAttendanceSummaryQuery request, CancellationToken cancellationToken)
        {
            return _service.GetDailySummaryAsync(request.Date, request.BusinessUnitId);
        }
    }
}
