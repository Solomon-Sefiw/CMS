using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Queries
{
    public record GetAllEducationLevelsQuery() : IRequest<EducationLevelLists>;
    public record EducationLevelLists(
         IEnumerable<EducationLevelDto> Approved,
         IEnumerable<EducationLevelDto> Submitted,
         IEnumerable<EducationLevelDto> Rejected,
         IEnumerable<EducationLevelDto> Draft
);

    public class GetAllEducationLevelsQueryHandler : IRequestHandler<GetAllEducationLevelsQuery, EducationLevelLists>
    {
        private readonly IDataService dataService;

        public GetAllEducationLevelsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<EducationLevelLists> Handle(GetAllEducationLevelsQuery query, CancellationToken cancellationToken)
        {
            var educationLevels = await dataService.EducationLevels
                .Select(a => new EducationLevelDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);

            var approved = educationLevels.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = educationLevels.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = educationLevels.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = educationLevels.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new EducationLevelLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }
}
