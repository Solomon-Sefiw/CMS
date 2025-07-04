using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Commands.RejectInstitutionName
{
    public record RejectInstitutionNameCommand(int Id) : IRequest<int>;

    public class RejectInstitutionNameCommandHandler : IRequestHandler<RejectInstitutionNameCommand, int>
    {
        private readonly IDataService dataService;

        public RejectInstitutionNameCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectInstitutionNameCommand command, CancellationToken cancellationToken)
        {
            var institutionName = dataService.InstitutionNames.Where(r => r.Id == command.Id).FirstOrDefault();

            institutionName.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return institutionName.Id;
        }
    }
}
