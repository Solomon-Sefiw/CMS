using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.ActivateBenefit
{
    public class ActivateBenefitCommandHandler : IRequestHandler<ActivateBenefitCommand, int>
    {
        private readonly IDataService _dataService;
        public ActivateBenefitCommandHandler(IDataService dataService)
        {
                _dataService = dataService;
        }
        public async Task<int> Handle(ActivateBenefitCommand request, CancellationToken cancellationToken)
        {
            var benefit = _dataService.Benefits.Where(b => b.Id == request.Id).FirstOrDefault();
            if (benefit != null)
            {
                benefit.IsActive= ActivationEnum.Active;
                benefit.Remark = request.remark;

            }
            await _dataService.SaveAsync(cancellationToken);
            return benefit.Id;
        }
    }
}

