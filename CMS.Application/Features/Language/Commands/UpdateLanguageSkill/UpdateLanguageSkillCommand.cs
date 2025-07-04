using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Domain.Language;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Language.Commands.UpdateLanguageSkill
{
    public class UpdateLanguageSkillCommand : IRequest<int>
    {
        public int Id { get; set; }
        public LanguageEnum Language { get; set; }
        public SkillLevelEnum Speaking { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Listening { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Writing { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Reading { get; set; } //  
    }
    public class UpdateLanguageSkillCommandHandler : IRequestHandler<UpdateLanguageSkillCommand,int>
    {
        private readonly IDataService dataService;
        private readonly IEmployeeChangeLogService employeeChangeLogService;
        public UpdateLanguageSkillCommandHandler(IDataService dataService, IEmployeeChangeLogService employeeChangeLogService)
        {
            this.dataService = dataService;
            this.employeeChangeLogService = employeeChangeLogService;
        }

        public async Task<int> Handle(UpdateLanguageSkillCommand request, CancellationToken cancellationToken)
        {
            var languageSkill = await dataService.LanguageSkills.FindAsync(request.Id);
            languageSkill.Language = request.Language;
            languageSkill.Speaking = request.Speaking;
            languageSkill.Listening = request.Listening;
            languageSkill.Writing = request.Writing;
            languageSkill.Reading = request.Reading;

            await dataService.SaveAsync(cancellationToken);
            await employeeChangeLogService.LogEmployeeLanguageChange(languageSkill, ChangeType.Modified, cancellationToken);

            return languageSkill.Id;
        }

    }

}
