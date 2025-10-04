using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Payments.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Queries
{
    public record GetPaymentsByBusinessUnitQuery(int BusinessUnitId) : IRequest<List<PaymentDto>>;

    public class GetPaymentsByBusinessUnitQueryHandler : IRequestHandler<GetPaymentsByBusinessUnitQuery, List<PaymentDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaymentsByBusinessUnitQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService; // will fix below
            _mapper = mapper;
        }

        public async Task<List<PaymentDto>> Handle(GetPaymentsByBusinessUnitQuery request, CancellationToken cancellationToken)
        {
            // we filter payments where the related case's BusinessUnitId matches
            var list = await _dataService.Payments
                .Include(p => p.Case)
                .ThenInclude(c => c.BusinessUnit)
                .Include(p => p.ProcessedBy)
                .Where(p => p.Case != null && p.Case.BusinessUnitId == request.BusinessUnitId)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<PaymentDto>>(list);
        }
    }
}
