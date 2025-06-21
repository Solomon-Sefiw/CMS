using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Queiries
{
    public record GetAllSubCitiesQuery() : IRequest<SubCityLists>;
    public record SubCityLists(
         IEnumerable<SubCityDto> Approved,
         IEnumerable<SubCityDto> Submitted,
         IEnumerable<SubCityDto> Rejected,
         IEnumerable<SubCityDto> Draft
);
}
