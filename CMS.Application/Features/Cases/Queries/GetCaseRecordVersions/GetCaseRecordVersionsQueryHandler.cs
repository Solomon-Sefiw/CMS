using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.Queries.GetCaseRecordVersions
{
    public record CaseRecordVersions(string Current, string? Approved, string? Submitted, string? Draft, string? Rejected);
    public record GetCaseRecordVersionsQuery(int Id) : IRequest<CaseRecordVersions>;
    internal class GetCaseRecordVersionsQueryHandler : IRequestHandler<GetCaseRecordVersionsQuery, CaseRecordVersions>
    {
        private readonly IDataService dataService;

        public GetCaseRecordVersionsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<CaseRecordVersions> Handle(GetCaseRecordVersionsQuery request, CancellationToken cancellationToken)
        {
            var current = await dataService.Cases.FirstOrDefaultAsync(s => s.Id == request.Id);
            if (current == null) { return null; }
            Guid currentVersion = current.VersionNumber;
            Guid? approvedVersion = null;
            Guid? rejectedVersion = null;

            if (current.ApprovalStatus != ApprovalStatus.Approved)
            {
                var approved = await dataService.Cases
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
                    rejectedVersion = await dataService.Cases
                        .TemporalFromTo(approved.PeriodEnd.AddMicroseconds(100), DateTime.UtcNow.AddMicroseconds(100))
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
                else
                {
                    rejectedVersion = await dataService.Cases
                        .TemporalAll()
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
            }

            return new CaseRecordVersions(
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
