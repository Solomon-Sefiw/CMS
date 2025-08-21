// CMS.Application/Features/Educations/Queries/ListEducationsByEmployee/ListEducationsByEmployeeQueryHandler.cs
using MediatR;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using CMS.Application.Features.Educations.Queries.GetEducationById;

namespace CMS.Application.Features.Educations.Queries.ListEducationsByEmployee
{
    public record GetEducationByIdQuery(int EmployeeId) : IRequest<List<EducationDto>>;
    public class GetEducationByIdQueryHandler : IRequestHandler<GetEducationByIdQuery, List<EducationDto>>
    {
        private readonly IDataService _dataService;

        public GetEducationByIdQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<EducationDto>> Handle(GetEducationByIdQuery request, CancellationToken cancellationToken)
        {
            var educations = await _dataService.Educations
                .Where(e => e.EmployeeId == request.EmployeeId)
                .Include(e => e.InstitutionName)
                .Include(e => e.EducationLevel)
                .Include(e => e.Award)
                .Include(e => e.FieldOfStudy) // Include FieldOfStudy
                .Select(e => new EducationDto
                {
                    Id = e.Id,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    SchoolCity = e.SchoolCity,
                    InstitutionNameId = e.InstitutionNameId,
                    InstitutionName = e.InstitutionName.Name,
                    EducationLevelId = e.EducationLevelId,
                    EducationLevelName = e.EducationLevel.Name,
                    AwardId = e.AwardId,
                    AwardName = e.Award.Name,
                    FieldOfStudyId = e.FieldOfStudyId,
                    FieldOfStudyName = e.FieldOfStudy.Name, // Get FieldOfStudy Name
                    EmployeeId = e.EmployeeId.Value,
                    CGPA=e.CGPA,
                })
                .ToListAsync(cancellationToken);

            return educations;
        }
    }
}