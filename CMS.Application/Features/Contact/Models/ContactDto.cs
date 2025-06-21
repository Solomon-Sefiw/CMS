using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CMS.Application.Features.Models
{
    public record ContactDto(
        int Id,
        ContactTypeEnum Type,
        string Value,
         ContactCategoryEnum ContactCategory,
         int RequestId
    );

}
