using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.Queries
{
    public record GetEmployeeInfoQuery(int employeeId, Guid? Version) : IRequest<EmployeeDto?>;
    public class GetEmployeeInfoQueryHandler : IRequestHandler<GetEmployeeInfoQuery, EmployeeDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetEmployeeInfoQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<EmployeeDto?> Handle(GetEmployeeInfoQuery request, CancellationToken cancellationToken)
        {
            var employee = await dataService.Employees.Include(a => a.Job).ThenInclude(a=>a.JobRole)
                .Include(a => a.BusinessUnits)
               .Where(s => s.Id == request.employeeId )
               //&&(request.Version != null && request.Version != Guid.Empty ? s.VersionNumber == request.Version : true))
               .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider)
               .FirstOrDefaultAsync();
            var businessUnits = await dataService.BusinessUnits.ToListAsync();
            var Jobs = await dataService.Jobs.Include(a => a.JobRole).ToListAsync();
            var employeeinfo = new EmployeeDto()
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                FirstName = employee.FirstName,
                MiddleName = employee.MiddleName,
                LastName = employee.LastName,
                DisplayName = employee.DisplayName,
                AmharicFirstName = employee.AmharicFirstName,
                AmharicMiddleName = employee.AmharicMiddleName,
                AmharicLastName = employee.AmharicLastName,
                AmharicDisplayName = employee.AmharicDisplayName,
                BusinessUnit = employee.BusinessUnits.Name,
                BusinessUnitID = employee.BusinessUnitID,
                JobId = employee.JobId,
                //businessUnits.FirstOrDefault(a => a.BusinessUnitID == employee.BusinessUnit).Name,
                JobTitle = employee.Job.JobRole.RoleName,
                PhotoId = employee.PhotoId,
                PhotoUrl = employee.PhotoUrl,
                BirthDate = employee.BirthDate,
                EmployementDate = employee.EmployementDate,
                Gender = employee.Gender,
                MartialStatus = employee.MartialStatus,
                ApprovalStatus = employee.ApprovalStatus,
                IsCurrent = employee.IsCurrent,
                IsNew = employee.IsNew,
                EmployeeDocuments = employee.EmployeeDocuments,
                EmployeeStatus = employee.EmployeeStatus,
                Job = employee.Job,
                WorkflowComment = employee.WorkflowComment,
                VersionNumber = employee.VersionNumber
            };


            // Manually set completeness flags after mapping.
            employeeinfo.HasAddressInfo = dataService.Addresses.Any(a => a.RequestId == employee.EmployeeId && a.AddressType == AddressTypeEnum.CurrentAddress);
            employeeinfo.HasContactInfo = dataService.Contacts.Any(a => a.RequestId == employee.EmployeeId && a.contactCategory == ContactCategoryEnum.EmployeeContact);
            employeeinfo.HasEmployeeFamilyInfo = dataService.EmployeeFamilies.Any(a => a.EmployeeId == employee.EmployeeId);
            employeeinfo.HasEmergencyContactInfo = dataService.EmployeeEmergencyContacts.Any(a => a.EmployeeId == employee.EmployeeId);
            employeeinfo.HasLanguageSkillInfo = dataService.LanguageSkills.Any(a => a.EmployeeId == employee.EmployeeId);
            if (employeeinfo != null)
            {

                var current = await dataService.Employees
                                  .Include(e => e.EmployeeDocuments.Where(ed => ed.IsDeleted != true))
                                  .AsNoTracking()
                                  .FirstOrDefaultAsync(e => e.Id == request.employeeId);

                var shareholderDocuments = await dataService.EmployeeDocuments
                    .Where(s => s.EmployeeId == request.employeeId &&
                        (s.DocumentType == DocumentType.EmployeePicture) &&
                        s.IsDeleted != true)
                    .Select(d => new { d.DocumentType, d.DocumentId }).ToListAsync();

                employeeinfo.PhotoId = current?.EmployeeDocuments
                    .Where(d => d.DocumentType == DocumentType.EmployeePicture)
                    .Select(d => d.DocumentId).FirstOrDefault();
            }


            return employeeinfo;

        }
    }
}