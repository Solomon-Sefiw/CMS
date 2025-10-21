using CMS.Domain.Enum;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Commands
{
    public class UpdateCaseFileDocumentCommand : IRequest<bool>
    {
        [FromForm]
        public Guid Id { get; set; }

        [FromForm]
        public IFormFile? File { get; set; }

        [FromForm]
        public string CaseDocumentType { get; set; } 
        public string Remark { get; set; }
    }
}
