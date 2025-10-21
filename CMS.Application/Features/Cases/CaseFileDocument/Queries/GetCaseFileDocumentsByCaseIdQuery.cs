using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.Queries
{
    using CMS.Application.Features.EmployeeFileDocument.Dto;
    using CMS.Domain.EmployeeDocument;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;

    public class GetCaseFileDocumentsByCaseIdQuery : IRequest<List<CaseFileDocumentDto>>
    {
        public int CaseId { get; set; } 
    }


}
