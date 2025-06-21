using FluentEmail.Liquid;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using CMS.Services.EmailService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;

namespace CMS.Application;

public class CreateEmailNotificationCommand : IRequest
{
    public EmailNotification Notification { get; set; }
}


public class CreateEmailNotificationCommandHandler : IRequestHandler<CreateEmailNotificationCommand>
{
    private readonly IExchangeEmail _emailService;
    private readonly IDataService dataService;
   // private readonly IBackgroundJobScheduler backgroundJobService;
    private readonly ILogger<CreateEmailNotificationCommandHandler> logger;

    public CreateEmailNotificationCommandHandler(IDataService dataService,IExchangeEmail exchangeEmail,
       // IBackgroundJobScheduler backgroundJobService,
        ILogger<CreateEmailNotificationCommandHandler> logger)
    {
        this.dataService = dataService;
        //this.backgroundJobService = backgroundJobService;
        this.logger = logger;
        this._emailService = exchangeEmail;
    }

    public async Task Handle(CreateEmailNotificationCommand request, CancellationToken cancellationToken)
    {
        var emailTemplate = await dataService.EmailTemplates.FirstOrDefaultAsync(t => t.EmailType == request.Notification.EmailType);

        if (emailTemplate != null)
        {

            var renderer = new LiquidRenderer(Options.Create(new LiquidRendererOptions()));
            var body = await renderer.ParseAsync(emailTemplate.EmailMessage, request.Notification.Model, emailTemplate.IsHtml);


            var email = new Email()
            {
                EmailTemplateId = emailTemplate.Id,
                Subject = request.Notification.Subject,
                ToEmail = request.Notification.ToEmail,
                ToName = request.Notification.ToName,
                Body = body,
                IsHtml = emailTemplate.IsHtml,
                Sent = false,
            };

            dataService.Emails.Add(email);

            await dataService.SaveAsync(cancellationToken);
            await _emailService.Send(email.Id);
          //  backgroundJobService.EnqueueEmail(email.Id);
        }
        else
        {
            logger.LogError("Unable to find email template for Email Type:{emailType}", request.Notification.EmailType);
        }
    }
}
