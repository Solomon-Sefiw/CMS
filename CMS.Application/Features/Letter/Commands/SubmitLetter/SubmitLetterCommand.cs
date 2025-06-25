using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.BusinessUnits.Commands.SubmitBusinessUnit;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Letter.Commands.SubmitLetter
{
    public class SubmitLetterCommand : IRequest<int>
    {
        public int Id { get; set; }
    }

    public class SubmitLetterCommandHandler : IRequestHandler<SubmitLetterCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitLetterCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitLetterCommand command, CancellationToken cancellationtoken)
        {
            var letter = dataService.Letters.Where(bu => bu.Id == command.Id).FirstOrDefault();

            letter.Status = LetterStatus.received;
            await dataService.SaveAsync(cancellationtoken);
            return letter.Id;
        }
    }

}
