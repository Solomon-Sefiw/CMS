using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.BusinessUnits
{
    public record GetBusinessUnitTypeQuery:IRequest<List<BusinessUnitType>>;
    internal class GetBusinessUnitTypeQueryHandler:IRequestHandler<GetBusinessUnitTypeQuery ,List<BusinessUnitType>>
    {
        private readonly IDataService dataService;

        public GetBusinessUnitTypeQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<List<BusinessUnitType>> Handle (GetBusinessUnitTypeQuery request,CancellationToken cancellationToken)
        {
            return await dataService.BusinessUnitTypes.Where(bu=>bu.IsActive==true).ToListAsync(cancellationToken);
        }
    }
}
