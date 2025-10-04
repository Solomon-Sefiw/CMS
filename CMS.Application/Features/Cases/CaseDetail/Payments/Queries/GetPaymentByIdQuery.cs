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
    public record GetPaymentByIdQuery(int Id) : IRequest<PaymentDto?>;

    public class GetPaymentByIdQueryHandler : IRequestHandler<GetPaymentByIdQuery, PaymentDto?>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaymentByIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaymentDto?> Handle(GetPaymentByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.Payments
                .Include(p => p.Case)
                .ThenInclude(c => c.BusinessUnit)
                .Include(p => p.ProcessedBy)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (entity == null) return null;

            return _mapper.Map<PaymentDto>(entity);
        }
    }
}
