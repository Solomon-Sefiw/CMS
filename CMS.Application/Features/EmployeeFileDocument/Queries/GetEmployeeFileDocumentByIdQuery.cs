using CMS.Application.Features.EmployeeFileDocument.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    public class GetEmployeeFileDocumentByIdQuery : IRequest<EmployeeFileDocumentDto>
    {
        public Guid Id { get; set; }
    }
}
