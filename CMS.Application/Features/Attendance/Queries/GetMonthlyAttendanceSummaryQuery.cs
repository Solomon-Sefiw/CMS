using CMS.Application.Features.Attendance.Interface;
using CMS.Application.Features.Attendance.Models;
using MediatR;
namespace CMS.Application.Features.Attendance.Queries
{
    public record GetMonthlyAttendanceSummaryQuery(int Year, int Month, int? EmployeeId) : IRequest<List<DailyAttendanceSummaryDto>>;
    internal class GetMonthlyAttendanceSummaryQueryHandler : IRequestHandler<GetMonthlyAttendanceSummaryQuery, List<DailyAttendanceSummaryDto>>
    {
        private readonly IAttendanceService _service;

        public GetMonthlyAttendanceSummaryQueryHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<List<DailyAttendanceSummaryDto>> Handle(GetMonthlyAttendanceSummaryQuery request, CancellationToken cancellationToken)
        {
            return _service.GetMonthlySummaryAsync(request.Year, request.Month, request.EmployeeId);
        }
    }
}
