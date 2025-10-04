using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Model
{
    public class EmployeeBasicInfoDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public int? BusinessUnitId { get; set; }
        public string BusinessUnitName { get; set; }
        public int? JobRoleId { get; set; }
        public string JobRoleName { get; set; }
    }
}
