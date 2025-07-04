using CMS.Application.Features.BranchGrades.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public record GetBranchGradeByDescriptionQuery(string description):IRequest<List<BranchGradeDto>>;

}
