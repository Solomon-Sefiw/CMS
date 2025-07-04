using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Commands.SubmitInstitutionName
{
    public record SubmitInstitutionNameCommand(int Id) : IRequest<int>;

    public class SubmitInstitutionNameCommandHandler : IRequestHandler<SubmitInstitutionNameCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitInstitutionNameCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitInstitutionNameCommand command, CancellationToken cancellationToken)
        {
            var institutionName = dataService.InstitutionNames.Where(r => r.Id == command.Id).FirstOrDefault();

            institutionName.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return institutionName.Id;
        }
    }
}
