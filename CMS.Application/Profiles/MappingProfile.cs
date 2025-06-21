using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Commands.CreateLetter;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Models;
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.letters;
using CMS.Domain.User;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<HRRole, ApplicationRole>();
            CreateMap<LetterDto, Letter>().ReverseMap();
            CreateMap<CreateLetterCommand, Letter>().ReverseMap();
            CreateMap<Letter, LetterDto>().ReverseMap();
            CreateMap<Region, RegionDto>();
            CreateMap<SubCity, SubCityDto>();
            CreateMap<WorkflowEnabledEntity, WorkflowEnabledEntityDto>()

            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
           .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));
        }
    }
}
