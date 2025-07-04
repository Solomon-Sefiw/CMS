using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Models
{
    public class EducationLevelDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

    }
}
