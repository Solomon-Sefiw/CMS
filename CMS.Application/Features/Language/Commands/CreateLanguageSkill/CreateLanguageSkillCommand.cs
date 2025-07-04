using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Language;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Language.Commands.CreateLanguageSkill
{
    public class CreateLanguageSkillCommand : IRequest<int>
    {
        public LanguageEnum Language { get; set; }
        public SkillLevelEnum Speaking { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Listening { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Writing { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Reading { get; set; } //     
        public int EmployeeId { get; set; }
    }

    public class CreateLanguageSkillCommandHandler : IRequestHandler<CreateLanguageSkillCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;

        public CreateLanguageSkillCommandHandler(IDataService dataService, IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;
        }

        public async Task<int> Handle(CreateLanguageSkillCommand request, CancellationToken cancellationToken)
        {
            var languageSkill = new LanguageSkill
            {
                Language = request.Language,
                Speaking = request.Speaking,
                Listening = request.Listening,
                Writing = request.Writing,
                Reading = request.Reading,
                EmployeeId = request.EmployeeId,
            };

            dataService.LanguageSkills.Add(languageSkill);
            await dataService.SaveAsync(cancellationToken);
            await employeeChangeLogService.LogEmployeeLanguageChange(languageSkill, ChangeType.Added, cancellationToken);

            return languageSkill.Id;
        }
    }


}
