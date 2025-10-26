//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using AutoMapper;
//using CMS.Domain;
//using CMS.Domain.Enum;
//using CMS.Domain.letters;
//using CMS.Domain.User;
//using CMS.Services.DataService;
//using MediatR;

//namespace CMS.Application.Features.Commands.CreateLetter
//{
//   public class CreateLetterCommand : IRequest<int>
//    {
//        public int Id { get; set; }
//        public string ReferenceNumber { get; set; }
//        public string Subject { get; set; }
//        public string Content { get; set; }
//        public LetterType LetterType { get; set; }
//        public LetterStatus Status { get; set; }
//        public string? SenderId { get; set; }
//        public string? RecipientId { get; set; }
//        public int BusinessUnitId { get; set; }

//    }

//    public class RegisterLetterHandler : IRequestHandler<CreateLetterCommand, int>
//    {
//        private readonly IMapper _mapper;
//        private readonly IDataService _context;

//        public RegisterLetterHandler(IMapper mapper, IDataService context)
//        {
//            _mapper = mapper;
//            _context = context;
//        }

//        public async Task<int> Handle(CreateLetterCommand request, CancellationToken cancellationToken)
//        {
//            var letter = _mapper.Map<Domain.letters.Letter>(request);
//            // Set current date
//            letter.ReceivedDate = DateTime.UtcNow;
//            letter.SentDate = DateTime.UtcNow;
//            _context.Letters.Add(letter);

//            await _context.SaveAsync(cancellationToken);
//            return letter.Id;
//        }
//    }
//}
using MediatR;
using CMS.Domain.letters;
using CMS.Services.DataService;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Letter.Commands.CreateLetter
{
    public class CreateLetterCommand : IRequest<int>
    {
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public string SenderId { get; set; }
        public int BusinessUnitId { get; set; }

        public List<string> RecipientIds { get; set; } = new();
        public List<string> CCUserIds { get; set; } = new();
        public List<int> CCDepartmentIds { get; set; } = new();
    }

    public class CreateLetterCommandHandler : IRequestHandler<CreateLetterCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateLetterCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateLetterCommand request, CancellationToken cancellationToken)
        {
            var letter = new Domain.letters.Letter
            {
                ReferenceNumber = request.ReferenceNumber,
                Subject = request.Subject,
                Content = request.Content,
                LetterType = request.LetterType,
                SenderId = request.SenderId,
                BusinessUnitId = request.BusinessUnitId,
                Status = LetterStatus.pending,
                SentDate = DateTime.Now
            };

            // Recipients
            foreach (var recipientId in request.RecipientIds.Distinct())
                letter.Recipients.Add(new LetterRecipient { RecipientId = recipientId });

            // CC Users
            foreach (var ccUserId in request.CCUserIds.Distinct())
                letter.CCRecipients.Add(new LetterCC { CCUserId = ccUserId });

            // CC Departments
            foreach (var ccDeptId in request.CCDepartmentIds.Distinct())
                letter.CCRecipients.Add(new LetterCC { CCDepartmentId = ccDeptId });

            _dataService.Letters.Add(letter);
            await _dataService.SaveAsync(cancellationToken);

            return letter.Id;
        }
    }
}
