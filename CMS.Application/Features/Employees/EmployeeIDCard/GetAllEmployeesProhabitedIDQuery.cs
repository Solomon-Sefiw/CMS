using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Application.Features.Jobs.JobGrades.Model;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeID.Queries
{
    public record EmployeeIDSearchResult(List<EmployeeDto> Items, int TotalCount);
    public record GetAllEmployeeIDListQuery(EmployeeIDCardStatus Status, int PageNumber, int PageSize) : IRequest<EmployeeIDSearchResult>;
    public class GetAllEmployeesProhabitedIDQueryHandler : IRequestHandler<GetAllEmployeeIDListQuery, EmployeeIDSearchResult>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public GetAllEmployeesProhabitedIDQueryHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<EmployeeIDSearchResult> Handle(GetAllEmployeeIDListQuery request, CancellationToken cancellationToken)
        {
               var employee = await dataService.Employees
           .Where(a => a.EmployeeStatus == Domain.Enums.EmployeeStatusEnum.Active &&
           a.ApprovalStatus == Domain.Enum.ApprovalStatus.Approved)
           .Include(a => a.EmployeeDocuments).
           Include(a => a.BusinessUnits)
           .Include(a => a.Job).ThenInclude(a => a.JobRole)    
           .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).ToListAsync();


            var employeeforId = new List<EmployeeDto>();
            if (request.Status == EmployeeIDCardStatus.IDCardApprovalRequest)
            {
             
                var result = employee.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRequest)
                                                .Skip((request.PageNumber - 1) * request.PageSize)
                                                .Take(request.PageSize)
                                                .ToList();
               var count = await dataService.
                   Employees.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRequest).CountAsync();
              
                 
                return new (result, count);
            }
            else if (request.Status == EmployeeIDCardStatus.IDNotGiven)
            {
               
                var result = employee.Where(emp =>emp.EmployeeIDCardStatus==EmployeeIDCardStatus.IDNotGiven)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
                var count = await dataService.Employees.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDNotGiven || emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardOnRegenerated).CountAsync();
                

                return new(result, count);
            }
            else if (request.Status == EmployeeIDCardStatus.IDCardApprovalRejected)
            {
                
                var result = employee.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRejected)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
                var count = await dataService.Employees.Where(emp =>
                        emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDCardApprovalRejected).CountAsync();
                
                return new(result, count);
            }
            else if(request.Status == EmployeeIDCardStatus.IDGiven)
            {
            
                var result = employee.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDGiven)
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize).ToList();
                var count = await dataService.Employees.Where(emp => emp.EmployeeIDCardStatus == EmployeeIDCardStatus.IDGiven).CountAsync();
                
                return new(result, count);
            }
            return null;
           
        }
    }
}
