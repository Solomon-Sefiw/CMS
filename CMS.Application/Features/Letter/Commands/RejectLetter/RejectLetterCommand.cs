using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Letter.Commands.RejectLetter
{
    public class RejectLetterCommand : IRequest<int>
    {
        public int Id { get; set; }
    }

    public class RejectLetterCommandHandler : IRequestHandler<RejectLetterCommand, int>
    {
        private readonly IDataService dataService;

        public RejectLetterCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectLetterCommand command, CancellationToken cancellationtoken)
        {
            var letter = dataService.Letters.Where(bu => bu.Id == command.Id).FirstOrDefault();

            letter.Status = LetterStatus.archived;
            await dataService.SaveAsync(cancellationtoken);
            return letter.Id;
        }
    }
}
