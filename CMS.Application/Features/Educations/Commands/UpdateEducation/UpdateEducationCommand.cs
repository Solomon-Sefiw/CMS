

 // CMS.Application/Features/Educations/Commands/UpdateEducation/UpdateEducationCommandHandler.cs
 using MediatR;
 using System.Threading;
 using System.Threading.Tasks;
 using CMS.Services.DataService;
 using CMS.Domain.Education;
 using CMS.Application.Exceptions;
 using Microsoft.EntityFrameworkCore;

 namespace CMS.Application.Features.Educations.Commands.UpdateEducation
{
    public class UpdateEducationCommand : IRequest<int>
    {
        public int Id { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string SchoolCity { get; set; }
        public int InstitutionNameId { get; set; }
        public int EducationLevelId { get; set; }
        public int AwardId { get; set; }
        public int FieldOfStudyId { get; set; } // New FieldOfStudyId
        public int EmployeeId { get; set; }
    }
    public class UpdateEducationCommandHandler : IRequestHandler<UpdateEducationCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateEducationCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateEducationCommand request, CancellationToken cancellationToken)
        {
            var educationToUpdate = await _dataService.Educations
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

            if (educationToUpdate == null)
            {
                throw new NotFoundException(nameof(Domain.Education.Education), request.Id);
            }

            educationToUpdate.StartDate = request.StartDate;
            educationToUpdate.EndDate = request.EndDate;
            educationToUpdate.SchoolCity = request.SchoolCity;
            educationToUpdate.InstitutionNameId = request.InstitutionNameId;
            educationToUpdate.EducationLevelId = request.EducationLevelId;
            educationToUpdate.AwardId = request.AwardId;
            educationToUpdate.FieldOfStudyId = request.FieldOfStudyId; // Update FieldOfStudyId
            educationToUpdate.EmployeeId = request.EmployeeId;

            await _dataService.SaveAsync(cancellationToken);

            return educationToUpdate.Id;
        }
    }
}