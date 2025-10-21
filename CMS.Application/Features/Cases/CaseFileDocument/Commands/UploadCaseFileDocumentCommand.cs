
using CMS.Domain.Enum;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

public class UploadCaseFileDocumentCommand : IRequest<Guid>
{
  [FromForm]
    public int CaseId { get; set; }

    public CaseDocumentType CaseDocumentType { get; set; }

    [FromForm]
    public IFormFile File { get; set; }
    public string Remark { get; set; }
}
