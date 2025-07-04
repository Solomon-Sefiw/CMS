using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Family.Queries
{
    public record GetEmployeeFamilyListOfFamilyQuery(int familyId) : IRequest<List<EmployeeFamily>>;
    public class GetEmployeeFamilyListOfFamilyHandler : IRequestHandler<GetEmployeeFamilyListOfFamilyQuery, List<EmployeeFamily>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeeFamilyListOfFamilyHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeFamily>> Handle(GetEmployeeFamilyListOfFamilyQuery request, CancellationToken cancellationToken)
        {
            var employeeFamily = await dataService.EmployeeFamilies
      .Where(s => s.Id == request.familyId)
      .ToListAsync();

            var employeeFamilyList = new List<EmployeeFamily>();

            foreach (var familyInfo in employeeFamily)
            {
                var familyInformation = new EmployeeFamily
                {
                    Id = familyInfo.Id,
                    FirstName = familyInfo.FirstName,
                    MiddleName = familyInfo.MiddleName,
                    LastName = familyInfo.LastName,
                    FatherFullName = familyInfo.FatherFullName,
                    MotherFullName = familyInfo.MotherFullName,
                    DateOfBirth = familyInfo.DateOfBirth,
                    ////Age = familyInfo.Age,
                    Gender = familyInfo.Gender,
                    ApprovalStatus = familyInfo.ApprovalStatus,
                    WorkingFirm = familyInfo.WorkingFirm,
                    familyType = familyInfo.familyType,
                    EmployeeId=familyInfo.EmployeeId,
                    SpouseIsWorking=familyInfo.SpouseIsWorking,
                    IsParentLiving = familyInfo.IsParentLiving,
                    FamilyParentType= familyInfo.FamilyParentType,
                    ParentLivelyHood=familyInfo.ParentLivelyHood,
                    IsActive=familyInfo.IsActive,
                };

                employeeFamilyList.Add(familyInformation);
            }

            return employeeFamilyList;

        }
   

    }


}