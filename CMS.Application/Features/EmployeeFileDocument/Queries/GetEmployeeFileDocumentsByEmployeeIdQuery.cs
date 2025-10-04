using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    using CMS.Application.Features.EmployeeFileDocument.Dto;
    using CMS.Domain.EmployeeDocument;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;

    public class GetEmployeeFileDocumentsByEmployeeIdQuery : IRequest<List<EmployeeFileDocumentDto>>
    {
        public int EmployeeId { get; set; } 
        public int? SuspensionId { get; set; }
        public int? ResignationId { get; set; }
    }


}
