using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Letter.Commands.ApproveLetter
{

    public class ApproveLetterCommand : IRequest<int>
    {
        public int Id { get; set; }
    }

    public class ApproveLetterCommandHandler : IRequestHandler<ApproveLetterCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveLetterCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveLetterCommand command, CancellationToken cancellationtoken)
        {
            var letter = dataService.Letters.Where(bu => bu.Id == command.Id).FirstOrDefault();

            letter.Status = LetterStatus.responded;
            await dataService.SaveAsync(cancellationtoken);
            return letter.Id;
        }
    }
}
