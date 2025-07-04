using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Models
{
    public class FieldOfStudyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

    }
}
