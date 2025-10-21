using CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Query
{
    public class GetAuditCaseFileDocumentLogs : IRequest<List<AuditCaseFileDocumentDto>>
    {
    }
}
