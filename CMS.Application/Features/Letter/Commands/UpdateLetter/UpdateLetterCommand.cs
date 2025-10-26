using CMS.Domain.Enum;
using CMS.Domain.letters;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Commands.UpdateLetter
{
    public class UpdateLetterCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public string SenderId { get; set; }
        public LetterStatus Status { get; set; }
        public List<string> RecipientIds { get; set; } = new();
        public List<string> CCUserIds { get; set; } = new();
        public List<int> CCDepartmentIds { get; set; } = new();
        public int BusinessUnitId { get; set; }
    }

    public class UpdateLetterCommandHandler : IRequestHandler<UpdateLetterCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateLetterCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateLetterCommand command, CancellationToken cancellationToken)
        {
            var letter = await _dataService.Letters
                .Include(l => l.Recipients)
                .Include(l => l.CCRecipients)
                .FirstOrDefaultAsync(l => l.Id == command.Id, cancellationToken);

            if (letter == null)
                throw new Exception("Letter not found");

            letter.ReferenceNumber = command.ReferenceNumber;
            letter.Subject = command.Subject;
            letter.Content = command.Content;
            letter.LetterType = command.LetterType;
            letter.SenderId = command.SenderId;
            letter.Status = command.Status;
            letter.BusinessUnitId = command.BusinessUnitId;

            // ✅ Replace Recipients
            _dataService.LetterRecipients.RemoveRange(letter.Recipients);
            letter.Recipients.Clear();
            foreach (var recId in command.RecipientIds.Distinct())
                letter.Recipients.Add(new LetterRecipient { LetterId = letter.Id, RecipientId = recId });

            // ✅ Replace CC Users and Departments
            _dataService.LetterCCs.RemoveRange(letter.CCRecipients);
            letter.CCRecipients.Clear();

            foreach (var ccUserId in command.CCUserIds.Distinct())
                letter.CCRecipients.Add(new LetterCC { LetterId = letter.Id, CCUserId = ccUserId });

            foreach (var ccDeptId in command.CCDepartmentIds.Distinct())
                letter.CCRecipients.Add(new LetterCC { LetterId = letter.Id, CCDepartmentId = ccDeptId });

            _dataService.Letters.Update(letter);
            await _dataService.SaveAsync(cancellationToken);

            return letter.Id;
        }
    }
}
