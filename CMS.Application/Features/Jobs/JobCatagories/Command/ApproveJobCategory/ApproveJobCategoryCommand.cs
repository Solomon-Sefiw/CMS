using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.ApproveJobCatagory
{
   public record ApproveJobCategoryCommand: IRequest<int>
    {
        public int Id { get; set; }
        public string Comment { get; set; } = string.Empty;


    }
}
