using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.DeleteJobCatatagory
{
    public record DeleteJobCategoryCommand:IRequest<Result>
    {
        public int Id { get; set; }
    }
}
