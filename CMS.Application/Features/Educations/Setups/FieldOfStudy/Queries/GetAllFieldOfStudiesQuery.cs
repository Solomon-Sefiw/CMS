using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Queries
{
    public record GetAllFieldOfStudiesQuery() : IRequest<FieldOfStudyLists>;
    public record FieldOfStudyLists(
         IEnumerable<FieldOfStudyDto> Approved,
         IEnumerable<FieldOfStudyDto> Submitted,
         IEnumerable<FieldOfStudyDto> Rejected,
         IEnumerable<FieldOfStudyDto> Draft
);

    public class GetAllFieldOfStudiesQueryHandler : IRequestHandler<GetAllFieldOfStudiesQuery, FieldOfStudyLists>
    {
        private readonly IDataService dataService;

        public GetAllFieldOfStudiesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<FieldOfStudyLists> Handle(GetAllFieldOfStudiesQuery query, CancellationToken cancellationToken)
        {
            var fieldOfStudyDtos = await dataService.FieldOfStudies
                .Select(a => new FieldOfStudyDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);

            var approved = fieldOfStudyDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = fieldOfStudyDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = fieldOfStudyDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = fieldOfStudyDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new FieldOfStudyLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }
}
