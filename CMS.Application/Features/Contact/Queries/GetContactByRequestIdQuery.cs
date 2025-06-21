using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Models;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Queries
{
    public record GetContactByRequestIdQuery(int RequestId, ContactCategoryEnum contactCategory, ContactTypeEnum type) : IRequest<ContactDto>;

}
