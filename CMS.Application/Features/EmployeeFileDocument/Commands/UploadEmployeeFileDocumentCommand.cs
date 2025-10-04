
using CMS.Domain.Enum;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

public class UploadEmployeeFileDocumentCommand : IRequest<Guid>
{
  [FromForm]
    public int EmployeeId { get; set; }
    [FromForm]
    public int? SuspensionId { get; set; }  
    [FromForm]
    public int? ResignationId { get; set; }
    [FromForm]
    public DocumentType DocumentType { get; set; }

    [FromForm]
    public IFormFile File { get; set; }
    public string Remark { get; set; }
}
