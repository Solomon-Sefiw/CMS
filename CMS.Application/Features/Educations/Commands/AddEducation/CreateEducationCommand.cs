using MediatR;
using CMS.Services.DataService;
using CMS.Domain.Education;

namespace CMS.Application.Features.Educations.Commands.CreateEducation
{
    public class CreateEducationCommand : IRequest<int>
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string SchoolCity { get; set; }
        public int InstitutionNameId { get; set; }
        public int EducationLevelId { get; set; }
        public int AwardId { get; set; }
        public int FieldOfStudyId { get; set; } // New FieldOfStudyId
        public int EmployeeId { get; set; }
    }

    public class CreateEducationCommandHandler : IRequestHandler<CreateEducationCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateEducationCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateEducationCommand request, CancellationToken cancellationToken)
        {
            var newEducation = new Education
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                SchoolCity = request.SchoolCity,
                InstitutionNameId = request.InstitutionNameId,
                EducationLevelId = request.EducationLevelId,
                AwardId = request.AwardId,
                FieldOfStudyId = request.FieldOfStudyId, 
                EmployeeId = request.EmployeeId
            };

            await _dataService.Educations.AddAsync(newEducation, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return newEducation.Id;
        }
    }
}
