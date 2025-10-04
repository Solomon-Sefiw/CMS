using AutoMapper;
using CMS.Application.Features;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.CreateAppointment;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Commands.UpdateAppointment;
using CMS.Application.Features.Cases.CaseDetail.Appointments.Models;
using CMS.Application.Features.Cases.CaseDetail.Archives.Commands.CreateDocketEntry;
using CMS.Application.Features.Cases.CaseDetail.Archives.Commands.UpdateDocketEntry;
using CMS.Application.Features.Cases.CaseDetail.Archives.Models;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.CreateCaseTemplate;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.UpdateCaseTemplate;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Models;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.CreateHearing;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.UpdateHearing;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Models;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.CreateJudgeAssignment;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.UpdateJudgeAssignment;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Models;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.CreateJudgment;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.UpdateJudgment;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Models;
using CMS.Application.Features.Cases.CaseDetail.Payments.Commands.CreatePayment;
using CMS.Application.Features.Cases.CaseDetail.Payments.Commands.UpdatePayment;
using CMS.Application.Features.Cases.CaseDetail.Payments.Models;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.CreateCaseTimeline;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.UpdateCaseTimeline;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Models;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Queries;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.Application.Features.Letter.Commands.UpdateLetter;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Models;
using CMS.Domain;
using CMS.Domain.Acting;
using CMS.Domain.Adress;
using CMS.Domain.Appointments;
using CMS.Domain.Archive;
using CMS.Domain.Assignment;
using CMS.Domain.Cases;
using CMS.Domain.Courts;
using CMS.Domain.Delegations;
using CMS.Domain.Education;
using CMS.Domain.Education.awards;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Hearings;
using CMS.Domain.Judgments;
using CMS.Domain.letters;
using CMS.Domain.Payments;
using CMS.Domain.Templates;
using CMS.Domain.Timelines;
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
            CreateMap<CreateCaseCommand, Case>().ReverseMap();
            CreateMap<BusinessUnit, BusinessUnitDto>();
            CreateMap<CreateBusinessUnitCommand, UpdateBusinessUnitCommand>().ReverseMap();
            CreateMap<EmployeeDto, Employee>().ReverseMap();
            CreateMap<CaseDto, Case>().ReverseMap();
            CreateMap<HRRole, ApplicationRole>();
            CreateMap<EmployeeChangeLog, EmployeeChangeLogDto>();
            CreateMap<Region, RegionDto>();
            CreateMap<Delegation, DelegationDto>();
            CreateMap<Acting, ActingDto>();
            CreateMap<JobRoleCategory, JobRoleCatagoryDto>();
            CreateMap<SubCity, SubCityDto>();
            CreateMap<Award, AwardDto>();
            CreateMap<EducationLevel, EducationLevelDto>();
            CreateMap<FieldOfStudy, FieldOfStudyDto>();
            CreateMap<InstitutionName, InstitutionNameDto>();
            CreateMap<EmployeeFamily, EmployeeFamilyDto>().ReverseMap();
            CreateMap<WorkflowEnabledEntity, WorkflowEnabledEntityDto>()
       .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
           .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));


            CreateMap<CreateJudgeAssignmentCommand, JudgeAssignment>();
            CreateMap<UpdateJudgeAssignmentCommand, JudgeAssignment>();
            CreateMap<Chilot, ChilotDto>().ReverseMap();
            CreateMap<JudgeAssignment, JudgeAssignmentDto>()
                .ForMember(dest => dest.JudgeName, opt => opt.MapFrom(src => src.Judge != null ? src.Judge.FirstName : null))
                .ForMember(dest => dest.CaseNumber, opt => opt.MapFrom(src => src.Case != null ? src.Case.CaseNumber : null))
                .ForMember(dest => dest.ChilotName, opt => opt.MapFrom(src => src.Chilot != null ? src.Chilot.Name : null))
                .ForMember(dest => dest.BusinessUnitName, opt => opt.MapFrom(src => src.BusinessUnit != null ? src.BusinessUnit.Name : null));


            CreateMap<CreateHearingCommand, Hearing>()
    .ForMember(dest => dest.HearingType, opt => opt.MapFrom(src => src.HearingType));

            CreateMap<UpdateHearingCommand, Hearing>()
                .ForMember(dest => dest.HearingType, opt => opt.MapFrom(src => src.HearingType ));

            CreateMap<Hearing, HearingDto>()
                .ForMember(dest => dest.CaseNumber, opt => opt.MapFrom(src => src.Case != null ? src.Case.CaseNumber : null))
                .ForMember(dest => dest.ChilotName, opt => opt.MapFrom(src => src.Chilot != null ? src.Chilot.Name : null))
                .ForMember(dest => dest.BusinessUnitName, opt => opt.MapFrom(src => src.BusinessUnit != null ? src.BusinessUnit.Name : null))
                .ForMember(dest => dest.HearingType, opt => opt.MapFrom(src => src.HearingType.ToString()));

            CreateMap<HearingParticipant, HearingParticipantDto>().ReverseMap();


            CreateMap<CreateJudgmentCommand, Judgment>();
            CreateMap<UpdateJudgmentCommand, Judgment>();

            CreateMap<Judgment, JudgmentDto>()
                .ForMember(dest => dest.CaseNumber, opt => opt.MapFrom(src => src.Case != null ? src.Case.CaseNumber : null))
                .ForMember(dest => dest.SignedByName, opt => opt.MapFrom(src => src.SignedBy != null ? src.SignedBy.FirstName : null));

            CreateMap<CreatePaymentCommand, Payment>();
            CreateMap<UpdatePaymentCommand, Payment>();

            CreateMap<Payment, PaymentDto>()
                .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.Case != null ? s.Case.CaseNumber : null))
                .ForMember(d => d.ProcessedByName, opt => opt.MapFrom(s => s.ProcessedBy != null ? s.ProcessedBy.FirstName : null))
                .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()));



            CreateMap<CreateDocketEntryCommand, DocketEntry>();
            CreateMap<UpdateDocketEntryCommand, DocketEntry>();
            CreateMap<DocketEntry, DocketEntryDto>();

            CreateMap<CreateAppointmentCommand, Appointment>();
            CreateMap<UpdateAppointmentCommand, Appointment>();
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));


            CreateMap<CreateCaseTemplateCommand, CaseTemplate>();
            CreateMap<UpdateCaseTemplateCommand, CaseTemplate>();

            CreateMap<CaseTemplate, CaseTemplateDto>()
                .ForMember(dest => dest.CreatedByName, opt => opt.MapFrom(src => src.CreatedBy != null ? src.CreatedBy.FirstName : string.Empty));


            CreateMap<CreateCaseTimelineCommand, CaseTimeline>()
               .ForMember(dest => dest.EventAt, opt => opt.MapFrom(src => src.EventAt ?? DateTime.UtcNow));

            CreateMap<UpdateCaseTimelineCommand, CaseTimeline>();

            CreateMap<CaseTimeline, CaseTimelineDto>()
                .ForMember(dest => dest.CaseNumber, opt => opt.MapFrom(src => src.Case != null ? src.Case.CaseNumber : null))
                .ForMember(dest => dest.ActorUserName, opt => opt.Ignore()); // map actor name separately if you have Users nav


        }
    }
}
