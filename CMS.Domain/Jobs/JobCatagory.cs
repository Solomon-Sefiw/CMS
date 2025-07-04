using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain
{
    public class JobCatagory
    {
        public int Id { get; set; }
        public string JobCategoryName { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public int ProbationPeriodInDays { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime LastModifiedAt { get; set; }


    }
}
