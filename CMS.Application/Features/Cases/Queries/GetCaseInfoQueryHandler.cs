using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.Queries
{
    public record GetCaseInfoQuery(int caseId, Guid? Version) : IRequest<CaseDto?>;
    public class GetCaseInfoQueryHandler : IRequestHandler<GetCaseInfoQuery, CaseDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetCaseInfoQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<CaseDto?> Handle(GetCaseInfoQuery request, CancellationToken cancellationToken)
        {
            var employee = await dataService.Cases.Include(a => a.Payments).Include(a=>a.Hearings)
                .Include(a => a.BusinessUnit).Include(a => a.Judgments)
               .Where(s => s.Id == request.caseId )
               .ProjectTo<CaseDto>(mapper.ConfigurationProvider)
               .FirstOrDefaultAsync();
            var businessUnits = await dataService.BusinessUnits.ToListAsync();
            var Jobs = await dataService.Jobs.Include(a => a.JobRole).ToListAsync();
            var employeeinfo = new CaseDto()
            {
                Id = employee.Id,
                CaseNumber = employee.CaseNumber,
                CaseType = employee.CaseType,
                Status = employee.Status,
                PlaintiffName = employee.PlaintiffName,
                AccusedName = employee.AccusedName,
                Subject = employee.Subject,
                FiledAt = employee.FiledAt,
                ClosedAt = employee.ClosedAt,
                FiledById = employee.FiledById,
                FiledBy = employee.FiledBy,
                AssignedJudgeId = employee.AssignedJudgeId,
                AssignedJudge = employee.AssignedJudge,
                BusinessUnitId = employee.BusinessUnitId,
                BusinessUnit = employee.BusinessUnit,
                ChilotId = employee.ChilotId,
                Chilot = employee.Chilot,
                ////businessUnits.FirstOrDefault(a => a.BusinessUnitID == employee.BusinessUnit).Name,
                //JobTitle = employee.Job.JobRole.RoleName,
                //PhotoId = employee.PhotoId,
                //PhotoUrl = employee.PhotoUrl,
                //BirthDate = employee.BirthDate,
                //EmployementDate = employee.EmployementDate,
                //Gender = employee.Gender,
                //MartialStatus = employee.MartialStatus,
                //ApprovalStatus = employee.ApprovalStatus,
                //IsCurrent = employee.IsCurrent,
                //IsNew = employee.IsNew,
                //EmployeeDocuments = employee.EmployeeDocuments,
                //EmployeeStatus = employee.EmployeeStatus,
                //Job = employee.Job,
                WorkflowComment = employee.WorkflowComment,
                VersionNumber = employee.VersionNumber
            };


            // Manually set completeness flags after mapping.
            employeeinfo.HasAddressInfo = dataService.Addresses.Any(a => a.RequestId == employee.Id && a.AddressType == AddressTypeEnum.CurrentAddress);

            return employeeinfo;

        }
    }
}