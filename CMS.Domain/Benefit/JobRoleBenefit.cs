using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Benefit
{
    public class JobRoleBenefit
    {
        public int Id { get; set; }

        public int JobRoleId { get; set; }
        public JobRole JobRole { get; set; }

        public int BenefitId { get; set; }
        public Benefit Benefit { get; set; }

        public int BenefitValueId { get; set; }
        public BenefitValue BenefitValue { get; set; }

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedDate { get; set; }

        //  audit fields
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }

}
