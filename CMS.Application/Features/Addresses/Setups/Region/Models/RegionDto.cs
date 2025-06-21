using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Addresses.Setups.Models
{
    public record RegionDto(
        int Id,
        string Name,
        string Description,
        ApprovalStatus ApprovalStatus
    );
}
