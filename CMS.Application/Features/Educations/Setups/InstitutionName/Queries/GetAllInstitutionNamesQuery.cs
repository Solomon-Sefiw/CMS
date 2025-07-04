using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Queries
{
    public record GetAllInstitutionNamesQuery() : IRequest<InstitutionNameLists>;
    public record InstitutionNameLists(
         IEnumerable<InstitutionNameDto> Approved,
         IEnumerable<InstitutionNameDto> Submitted,
         IEnumerable<InstitutionNameDto> Rejected,
         IEnumerable<InstitutionNameDto> Draft
);

    public class GetAllInstitutionNamesQueryHandler : IRequestHandler<GetAllInstitutionNamesQuery, InstitutionNameLists>
    {
        private readonly IDataService dataService;

        public GetAllInstitutionNamesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<InstitutionNameLists> Handle(GetAllInstitutionNamesQuery query, CancellationToken cancellationToken)
        {
            var institutionNameDtos = await dataService.InstitutionNames
                .Select(a => new InstitutionNameDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);

            var approved = institutionNameDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = institutionNameDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = institutionNameDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = institutionNameDtos.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new InstitutionNameLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }
}
