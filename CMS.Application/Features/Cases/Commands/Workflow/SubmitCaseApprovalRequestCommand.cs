using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application;


public record SubmitCaseApprovalRequestCommand(int Id, string Note) : IRequest;

public class SubmitCaseApprovalRequestCommandHandler : IRequestHandler<SubmitCaseApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public SubmitCaseApprovalRequestCommandHandler(IDataService dataService,
                                                          IMediator mediator
                                                         )
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }
    public async Task Handle(SubmitCaseApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var Case = await dataService.Cases.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (Case != null)
        {
            Case.ApprovalStatus = ApprovalStatus.Submitted;
            //await SubmitContactsChange(request);
            //await SubmitBlockedStatusChange(request);
            //await SubmitSubscriptionChanges(request);
            //await SubmitSubscriptionPaymentChanges(request);
            //await SubmitTransferChanges(request);
            //await SubmitDividendDecisions(request);
            //await SubmitCertificateChanges(request);


            await dataService.SaveAsync(cancellationToken);
            //await mediator.Send(new AddEmployeeCommentCommand(request.Id, CommentType.Submission, request.Note));
           // await shareholderSummaryService.ComputeShareholderSummaries(request.Id, true, cancellationToken);
        }
    }

   
    //private async Task SubmitContactsChange(SubmitShareholderApprovalRequestCommand request)
    //{
    //    var contactsToSubmit = await dataService.Contacts
    //        .Where(c => c.ShareholderId == request.Id && c.ApprovalStatus == ApprovalStatus.Draft)
    //        .ToListAsync();

    //    foreach (var contact in contactsToSubmit)
    //        contact.ApprovalStatus = ApprovalStatus.Submitted;
    //}

    //private async Task SubmitBlockedStatusChange(SubmitShareholderApprovalRequestCommand request)
    //{
    //    var blockedStatuses = await dataService.BlockedShareholders
    //        .Where(b => b.ShareholderId == request.Id && b.ApprovalStatus == ApprovalStatus.Draft)
    //        .ToListAsync();

    //    foreach (var blockedStatus in blockedStatuses)
    //        blockedStatus.ApprovalStatus = ApprovalStatus.Submitted;
    //}

    //private async Task SubmitSubscriptionPaymentChanges(SubmitShareholderApprovalRequestCommand request)
    //{
    //    var payments = await dataService.Payments
    //        .Where(payment => payment.ApprovalStatus == ApprovalStatus.Draft && payment.Subscription.ShareholderId == request.Id)
    //        .ToListAsync();

    //    foreach (var payment in payments)
    //        payment.ApprovalStatus = ApprovalStatus.Submitted;

    //}
    //private async Task SubmitCertificateChanges(SubmitShareholderApprovalRequestCommand request)
    //{
    //    var certificates = await dataService.Certficates
    //        .Where(certificate => certificate.ApprovalStatus == ApprovalStatus.Draft && certificate.ShareholderId == request.Id)
    //        .ToListAsync();

    //    foreach (var certificate in certificates)
    //        certificate.ApprovalStatus = ApprovalStatus.Submitted;

    //}
}
