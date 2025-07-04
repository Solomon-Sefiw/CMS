using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models
{
    public record JobRoleCatagoryDto(
    int Id,
    string Name,
    string Description,
    ApprovalStatus ApprovalStatus
);
}
