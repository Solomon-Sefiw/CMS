using CMS.Application.Features.EmployeeFileDocument.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.Queries
{
    public class GetCaseFileDocumentByIdQuery : IRequest<CaseFileDocumentDto>
    {
        public Guid Id { get; set; }
    }
}
