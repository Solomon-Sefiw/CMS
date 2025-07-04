using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
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
    public record GetEmployeeFamilyListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeeFamilyDto>>;
    public class GetEmployeeFamilyListOfEmployeeHandler : IRequestHandler<GetEmployeeFamilyListOfEmployeeQuery, List<EmployeeFamilyDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeeFamilyListOfEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeFamilyDto?>> Handle(GetEmployeeFamilyListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            var employeefamily = await dataService.EmployeeFamilies
      .Include(a => a.Employees)
      .Where(s => s.EmployeeId == request.EmployeeId)
      .ToListAsync();
            var employeeFamilyList = new List<EmployeeFamilyDto>();

            foreach (var familyInfo in employeefamily)
            {
                var familyInformation = new EmployeeFamilyDto
                {
                        Id=familyInfo.Id,
                       FullName = familyInfo.FirstName+" "+ familyInfo.MiddleName+" "+ familyInfo.LastName,
                       FirstName= familyInfo.FirstName,
                       MiddleName= familyInfo.MiddleName,
                       LastName=familyInfo.LastName,
                       FatherFullName=familyInfo.FatherFullName,
                       MotherFullName =familyInfo.MotherFullName,
                       DateOfBirth =familyInfo.DateOfBirth,
                       //Age =familyInfo.Age,
                       Gender=familyInfo.Gender.ToString(),
                       ApprovalStatus =familyInfo.ApprovalStatus,
                       WorkingFirm=familyInfo.WorkingFirm,
                      familyType = familyInfo.familyType,
                     SpouseIsWorking=familyInfo.SpouseIsWorking,
                      IsParentLiving=familyInfo.IsParentLiving,
                    FamilyParentType = familyInfo.FamilyParentType,
                    ParentLivelyHood = familyInfo.ParentLivelyHood,
                    IsActive = (ActivationEnum)familyInfo.IsActive,
                    comment = familyInfo.comment,

                };

                employeeFamilyList.Add(familyInformation);
            }

            return employeeFamilyList;

        }
   

    }


}