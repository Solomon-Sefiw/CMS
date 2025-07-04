using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeID.Queries
{

    public class GetActiveEmployeesForIdManagement : IRequest<List<EmployeeDto>>
    {
    }
    public class GetActiveEmployeesForIdManagementHandler : IRequestHandler<GetActiveEmployeesForIdManagement, List<EmployeeDto>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetActiveEmployeesForIdManagementHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }


        public async Task<List<EmployeeDto>> Handle(GetActiveEmployeesForIdManagement request, CancellationToken cancellationToken)
        {
            var employeeforId = new List<EmployeeDto>();
            var employee = await dataservice.Employees
                .Where(a => a.EmployeeStatus == Domain.Enums.EmployeeStatusEnum.Active &&
                a.ApprovalStatus == Domain.Enum.ApprovalStatus.Approved && a.EmployeeIDCardStatus==Domain.Enum.EmployeeIDCardStatus.IDCardApproved).Include(a => a.BusinessUnits)
                .Include(a => a.Job).ThenInclude(a => a.JobRole).Include(a=>a.EmployeeDocuments)
                .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).ToListAsync();
            foreach(var emp in employee)
            {
                var address = await dataservice.Addresses
                .Where(a => a.RequestId == emp.Id).FirstOrDefaultAsync();
                var contact = await dataservice.Contacts
                    .Where(a => a.RequestId == emp.Id).FirstOrDefaultAsync();
                
                var employeeId = new EmployeeDto
                { 
                EmployeeId=emp.EmployeeId,
                DisplayName=emp.DisplayName,
                Job=emp.Job,
                BusinessUnits=emp.BusinessUnits,
                EmployementDate=emp.EmployementDate,
                PhotoUrl=emp.PhotoUrl,
                ApprovedAt=emp.ApprovedAt,
                Address=address,
                Contact=contact,
                EmployeeDocuments=emp.EmployeeDocuments
                };
                employeeforId.Add(employeeId);
            }

            return employeeforId;
        }
    }
}
