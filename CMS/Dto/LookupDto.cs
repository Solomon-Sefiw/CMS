using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Domain;

namespace CMS.API.Dto
{
    public class LookupDto
    {
        public BusinessUnitLists BusinessUnits { get; set; }
        public List<BusinessUnitType> BusinessUnitTypes { get; set; }
    }
}
