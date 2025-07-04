using CMS.Application.Features.Benefits.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Queries
{
    public record GetAllBenefitsQuery() : IRequest<List<BenefitDto>>;

}
