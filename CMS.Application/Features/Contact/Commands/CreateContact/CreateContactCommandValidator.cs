using CMS.Application.Features.Commands.CreateContact;

using FluentValidation;
using CMS.Domain.Contacts;
using CMS.Domain.Enum;

public class CreateContactCommandValidator : AbstractValidator<CreateContactCommand>
{
    public CreateContactCommandValidator()
    {
        RuleFor(contact => contact.Type)
            .IsInEnum()
            .WithMessage("Contact type must be a valid enum value.");

        RuleFor(contact => contact.Value)
            .NotEmpty()
            .WithMessage("Value is required.")
            .When(contact => contact.Type != ContactTypeEnum.PoBox);

        RuleFor(contact => contact.Value)
            .EmailAddress()
            .WithMessage("Value must be a valid email address.")
            .When(contact => contact.Type == ContactTypeEnum.Email);

        RuleFor(x => x.Value)
           .NotEmpty()
           .Length(10, 15) // or 9, 15 depending on your use case
           .Matches(@"^\+?[0-9]{7,15}$")
           .WithMessage("Value must be a valid phone number.")
           .When(contact => contact.Type == ContactTypeEnum.CellPhone ||
                     contact.Type == ContactTypeEnum.HomePhone ||
                     contact.Type == ContactTypeEnum.WorkPhone);

        RuleFor(contact => contact.Value)
            .Matches(@"^\d{5,10}$")
            .WithMessage("Value must be a valid PO Box number.")
            .When(contact => contact.Type == ContactTypeEnum.PoBox);
    }
}
