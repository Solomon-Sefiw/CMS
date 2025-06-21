using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain.Adress
{
    public class SubCity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RegionId { get; set; }
        public Region Region { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    }

}
