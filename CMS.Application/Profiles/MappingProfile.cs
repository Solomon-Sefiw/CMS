using AutoMapper;
using CMS.Application.Features;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Queries;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Models;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Models;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Models;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Models;
using CMS.Domain;
using CMS.Domain.Acting;
using CMS.Domain.Adress;
using CMS.Domain.Delegations;
using CMS.Domain.Education;
using CMS.Domain.Education.awards;
using CMS.Domain.Employee;
using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.Enum;
using CMS.Domain.letters;
using CMS.Domain.User;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<LetterDto, Letter>().ReverseMap();
            CreateMap<Letter, LetterDto>().ReverseMap();
            CreateMap<CreateLetterCommand, Letter>().ReverseMap();
            CreateMap<UpdateLetterCommand, Letter>().ReverseMap();
            CreateMap<Letter, LetterDto>().ReverseMap();
            CreateMap<CreateEmployeeProfileCommand, Employee>().ReverseMap();
            CreateMap<BusinessUnit, BusinessUnitDto>();
            CreateMap<CreateBusinessUnitCommand, UpdateBusinessUnitCommand>().ReverseMap();
            CreateMap<EmployeeDto, Employee>().ReverseMap();
            CreateMap<Employee, EmployeeDetailsDto>().ReverseMap();
            CreateMap<HRRole, ApplicationRole>();
            CreateMap<EmployeeChangeLog, EmployeeChangeLogDto>();
            CreateMap<Region, RegionDto>();
            CreateMap<Delegation, DelegationDto>();
            CreateMap<EmployeeWarning, EmployeeWarningDto>();
            CreateMap<Suspension, SuspensionDto>();
            CreateMap<Resignation, ResignationDto>();
            CreateMap<Acting, ActingDto>();
            CreateMap<JobRoleCategory, JobRoleCatagoryDto>();
            CreateMap<SubCity, SubCityDto>(); 
            CreateMap<Award, AwardDto>(); 
            CreateMap<EducationLevel, EducationLevelDto>(); 
            CreateMap<FieldOfStudy, FieldOfStudyDto>(); 
            CreateMap<InstitutionName, InstitutionNameDto>(); 
            CreateMap<EmployeeFamily,EmployeeFamilyDto>().ReverseMap();
            CreateMap<WorkflowEnabledEntity, WorkflowEnabledEntityDto>()
       .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
           .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));

        }
    }
}
