using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain
{
    public class Permission
    {
        public Guid Id { get; set; }
        public string ClaimValue { get; set; }
        public ClaimCategory ClaimCategory { get; set; }
    }
}
