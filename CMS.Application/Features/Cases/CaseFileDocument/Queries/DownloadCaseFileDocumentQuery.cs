using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    public class DownloadCaseFileDocumentQuery : IRequest<(Stream FileStream, string ContentType, string FileName)>
    {
        public Guid DocumentId { get; set; }
    }

}
