using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain.Language
{
    public class LanguageSkill
    {
        public int Id { get; set; }
        public LanguageEnum Language { get; set; }
       // public SkillTypeEnum SkillType { get; set; } // Speaking, Listening, Writing, Reading
       // public SkillLevelEnum SkillLevel { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Speaking { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Listening { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Writing { get; set; } //     Beginner = 1, Intermediate,Advanced,Proficient, Native
        public SkillLevelEnum Reading { get; set; } //     
        public int EmployeeId { get; set; }
        public Domain.Employee.Employee? Employee { get; set; }
    }
}
