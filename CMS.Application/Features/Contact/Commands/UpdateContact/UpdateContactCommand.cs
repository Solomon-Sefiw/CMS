using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Commands.UpdateContact
{
    public record UpdateContactCommand(
        int Id,
        ContactTypeEnum Type,
        string Value,
        ContactCategoryEnum ContactCategory,
        int RequestId
    ) : IRequest<int>;

}
