using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application
{
    public record EmployeeRecordVersions(string Current, string? Approved, string? Submitted, string? Draft, string? Rejected);
    public record GetEmployeeRecordVersionsQuery(int Id) : IRequest<EmployeeRecordVersions>;
    internal class GetEmployeeRecordVersionsQueryHandler : IRequestHandler<GetEmployeeRecordVersionsQuery, EmployeeRecordVersions>
    {
        private readonly IDataService dataService;

        public GetEmployeeRecordVersionsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<EmployeeRecordVersions> Handle(GetEmployeeRecordVersionsQuery request, CancellationToken cancellationToken)
        {
            var current = await dataService.Employees.FirstOrDefaultAsync(s => s.Id == request.Id);
            if (current == null) { return null; }
            Guid currentVersion = current.VersionNumber;
            Guid? approvedVersion = null;
            Guid? rejectedVersion = null;

            if (current.ApprovalStatus != ApprovalStatus.Approved)
            {
                var approved = await dataService.Employees
                    .TemporalAll()
                    .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Approved)
                    .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                    .Select(s =>
                    new
                    {
                        PeriodEnd = EF.Property<DateTime>(s, "PeriodEnd"),
                        PeriodStart = EF.Property<DateTime>(s, "PeriodEnd"),
                        Version = s.VersionNumber
                    }).FirstOrDefaultAsync();

                approvedVersion = approved?.Version;

                if (approved != null)
                {
                    rejectedVersion = await dataService.Employees
                        .TemporalFromTo(approved.PeriodEnd.AddMicroseconds(100), DateTime.UtcNow.AddMicroseconds(100))
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
                else
                {
                    rejectedVersion = await dataService.Employees
                        .TemporalAll()
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
            }

            return new EmployeeRecordVersions(
                Current: convertToStr(currentVersion),
                Approved: convertToStr(current.ApprovalStatus == ApprovalStatus.Approved ? currentVersion : approvedVersion),
                Submitted: convertToStr(current.ApprovalStatus == ApprovalStatus.Submitted ? currentVersion : null),
                Draft: convertToStr(current.ApprovalStatus == ApprovalStatus.Draft ? currentVersion : null),
                Rejected: convertToStr(current.ApprovalStatus == ApprovalStatus.Rejected ? currentVersion : rejectedVersion));
        }

        private string? convertToStr(Guid? guid)
        {
            return guid == null || guid == Guid.Empty ? null : guid.ToString();
        }
    }
}
