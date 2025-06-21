using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Commands.UpdateLetter
{
    public class UpdateLetterCommand : IRequest<int> // Common to return Unit for update commands
    {
        public int Id { get; set; } // Required to identify the letter to update
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public LetterStatus Status { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime? SentDate { get; set; }
        public string? SenderId { get; set; }
        public string? RecipientId { get; set; }
        public int BusinessUnitId { get; set; }
    }

    public class UpdateLetterHandler : IRequestHandler<UpdateLetterCommand, int>
    {
        private readonly IMapper _mapper;
        private readonly IDataService _context;

        public UpdateLetterHandler(IMapper mapper, IDataService context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<int> Handle(UpdateLetterCommand request, CancellationToken cancellationToken)
        {
            var letter = await _context.Letters.FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

            if (letter == null)
            {
                // Handle not found scenario, e.g., throw a NotFoundException or return a specific error
                throw new Exception($"Letter with Id {request.Id} not found.");
            }

            _mapper.Map(request, letter); // Map properties from request onto the existing letter entity

            await _context.SaveAsync(cancellationToken);

            return letter.Id; // Return Unit.Value for IRequest<Unit>
        }
    }
}
