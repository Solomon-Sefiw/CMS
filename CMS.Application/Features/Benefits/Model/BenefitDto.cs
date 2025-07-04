using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Model
{
    public class BenefitDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UnitOfMeasurementId { get; set; }
        public string UnitName { get; set; } = string.Empty; 
        public ApprovalStatus ApprovalStatus { get; set; }
        public ActivationEnum IsActive { get; set; }
        public string? Remark { get; set; }
    }

}
