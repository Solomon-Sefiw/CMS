using CMS.Application.Features.Language.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Language.Queries
{
    public record GetLanguageSkillByIdQuery(int EmployeeId) : IRequest<List<LanguageSkillDto>>;


    public class GetLanguageSkillByIdQueryHandler : IRequestHandler<GetLanguageSkillByIdQuery, List<LanguageSkillDto>>
    {
        private readonly IDataService dataService;

        public GetLanguageSkillByIdQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<List<LanguageSkillDto>> Handle(GetLanguageSkillByIdQuery request, CancellationToken cancellationToken)
        {
            var languages = await dataService.LanguageSkills
                     .Where(x => x.EmployeeId == request.EmployeeId)
                     .ToListAsync(cancellationToken);

            return languages.Select(e => new LanguageSkillDto
            {
                Id = e.Id,
                Language = e.Language,
                Speaking = e.Speaking,
                Listening = e.Listening,
                Writing = e.Writing,
                Reading = e.Reading,
                EmployeeId = e.EmployeeId

            }).ToList();
        }
    }
}
