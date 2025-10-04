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
    public record GetPaymentsByCaseIdQuery(int CaseId) : IRequest<List<PaymentDto>>;

    public class GetPaymentsByCaseIdQueryHandler : IRequestHandler<GetPaymentsByCaseIdQuery, List<PaymentDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaymentsByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<PaymentDto>> Handle(GetPaymentsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.Payments
                .Where(p => p.CaseId == request.CaseId)
                .Include(p => p.ProcessedBy)
                .Include(p => p.Case)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<PaymentDto>>(list);
        }
    }
}
