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
        public int Id { get; set; }
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public LetterStatus Status { get; set; }
        public string? SenderId { get; set; }
        public string? RecipientId { get; set; }
        public int BusinessUnitId { get; set; }
        public bool IsEditableDocument { get; set; }
        public string? DocumentJsonContent { get; set; }
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

            if (letter.Status == LetterStatus.archived)
            {
                letter.Status = LetterStatus.pending; // Fixed assignment operator
            }
            else
            {
                letter.Status = request.Status; // Update the status if not archived
            }

            _mapper.Map(request, letter); // Map properties from request onto the existing letter entity

            await _context.SaveAsync(cancellationToken);

            return letter.Id; // Return Unit.Value for IRequest<Unit>
        }
    }
}
