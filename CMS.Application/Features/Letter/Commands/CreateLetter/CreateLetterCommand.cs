using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Domain.letters;
using CMS.Domain.User;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Commands.CreateLetter
{
   public class CreateLetterCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public LetterStatus Status { get; set; }
        public string? SenderId { get; set; }
        public string? RecipientId { get; set; }
        public int BusinessUnitId { get; set; }

    }

    public class RegisterLetterHandler : IRequestHandler<CreateLetterCommand, int>
    {
        private readonly IMapper _mapper;
        private readonly IDataService _context;

        public RegisterLetterHandler(IMapper mapper, IDataService context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<int> Handle(CreateLetterCommand request, CancellationToken cancellationToken)
        {
            var letter = _mapper.Map<Domain.letters.Letter>(request);
            // Set current date
            letter.ReceivedDate = DateTime.UtcNow;
            letter.SentDate = DateTime.UtcNow;
            _context.Letters.Add(letter);

            await _context.SaveAsync(cancellationToken);
            return letter.Id;
        }
    }
}


