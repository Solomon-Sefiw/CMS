using CMS.Application.Features.Reemployments.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Queries
{
    public record GetAllReemploymentsQuery():IRequest<List<ReemploymentDto>>;

}
