using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Commands.ApproveInstitutionName
{
    public record ApproveInstitutionNameCommand(int Id) : IRequest<int>;

    public class ApproveInstitutionNameCommandHandler : IRequestHandler<ApproveInstitutionNameCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveInstitutionNameCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveInstitutionNameCommand command, CancellationToken cancellationToken)
        {
            var institutionName = dataService.InstitutionNames.Where(r => r.Id == command.Id).FirstOrDefault();

            institutionName.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return institutionName.Id;
        }
    }
}
