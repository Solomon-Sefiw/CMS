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
    public record GetPaymentByIdQuery(int Id) : IRequest<PaymentDto>;

    public class GetPaymentByIdHandler : IRequestHandler<GetPaymentByIdQuery, PaymentDto>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaymentByIdHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaymentDto> Handle(GetPaymentByIdQuery request, CancellationToken cancellationToken)
        {
            var p = await _dataService.Payments.FindAsync(request.Id);
            return _mapper.Map<PaymentDto>(p);
        }
    }
}
