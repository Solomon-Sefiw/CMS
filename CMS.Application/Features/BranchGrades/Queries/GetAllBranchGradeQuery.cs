using CMS.Application.Features.BranchGrades.Model;
using CMS.Domain.BranchGrade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Queries
{
    public record GetAllBranchGradeQuery:IRequest<List<BranchGrade>>;

}
