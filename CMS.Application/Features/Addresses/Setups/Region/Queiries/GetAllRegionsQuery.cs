using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.BusinessUnits;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Queiries
{
    public record GetAllRegionsQuery() : IRequest<RegionLists>;
    public record RegionLists(
    IEnumerable<RegionDto> Approved,
    IEnumerable<RegionDto> Submitted,
    IEnumerable<RegionDto> Rejected,
    IEnumerable<RegionDto> Draft
    );
}
