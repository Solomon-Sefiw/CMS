using CMS.Application.Exceptions;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Language.Commands.DeleteLanguageSkill
{
    public class DeleteLanguageSkillCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteLanguageSkillCommandHandler : IRequestHandler<DeleteLanguageSkillCommand>
    {
        private readonly IDataService dataService;

        public DeleteLanguageSkillCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task Handle(DeleteLanguageSkillCommand request, CancellationToken cancellationToken)
        {
            var languageSkill = await dataService.LanguageSkills.FindAsync(request.Id);

            if (languageSkill == null)
            {
                throw new NotFoundException(nameof(Domain.Language.LanguageSkill), request.Id);
            }

            dataService.LanguageSkills.Remove(languageSkill);
            await dataService.SaveAsync(cancellationToken);
        }
    }
}