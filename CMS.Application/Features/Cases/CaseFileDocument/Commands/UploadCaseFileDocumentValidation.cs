using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Commands
{
    public class UploadCaseFileDocumentCommandValidator : AbstractValidator<UploadCaseFileDocumentCommand>
    {
        public UploadCaseFileDocumentCommandValidator()
        {
            RuleFor(x => x.CaseId).GreaterThan(0);
            RuleFor(x => x.CaseDocumentType).IsInEnum();
            RuleFor(x => x.File)
                .NotNull().WithMessage("File is required.")
                .Must(f => f.Length > 0).WithMessage("Uploaded file is empty.")
                .Must(f => f.Length <= 10 * 1024 * 1024).WithMessage("Max file size is 10 MB.");
        }
    }
}
