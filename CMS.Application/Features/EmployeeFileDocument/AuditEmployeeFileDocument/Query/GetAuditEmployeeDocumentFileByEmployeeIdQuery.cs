using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Query
{
    public class GetAuditEmployeeDocumentFileByEmployeeIdQuery:IRequest<List<AuditEmployeeFileDocumentDto>>
    {
        public int EmployeeId { get; set; }
    }
}
