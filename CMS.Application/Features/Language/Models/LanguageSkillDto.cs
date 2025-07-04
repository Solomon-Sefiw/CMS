using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Language.Models
{
    public class LanguageSkillDto
    {
        public int Id { get; set; }
        public LanguageEnum Language { get; set; }
        public SkillLevelEnum Speaking { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Listening { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Writing { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Reading { get; set; } //       Beginner = 1, Intermediate,Advanced,Proficient, Native
        public int EmployeeId { get; set; }
    }
}
