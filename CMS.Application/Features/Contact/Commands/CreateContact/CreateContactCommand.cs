using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Commands.CreateContact
{
    public record CreateContactCommand(
        ContactTypeEnum Type,
        string Value,
        ContactCategoryEnum ContactCategory,
        int RequestId
    ) : IRequest<int>;

}
