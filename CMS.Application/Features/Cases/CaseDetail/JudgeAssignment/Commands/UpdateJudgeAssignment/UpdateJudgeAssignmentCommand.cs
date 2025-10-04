using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.UpdateJudgeAssignment
{
    public class UpdateJudgeAssignmentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int? CaseId { get; set; }
        public int? ChilotId { get; set; }
        public int? BusinessUnitId { get; set; }
        public string? JudgeId { get; set; }
        public string? Role { get; set; }
    }

    public class UpdateJudgeAssignmentCommandHandler : IRequestHandler<UpdateJudgeAssignmentCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public UpdateJudgeAssignmentCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateJudgeAssignmentCommand request, CancellationToken cancellationToken)
        {
            // 🔍 Step 1: Retrieve the existing JudgeAssignment
            var entity = await _dataService.JudgeAssignments
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (entity == null)
                throw new Exception($"Judge Assignment with ID {request.Id} not found.");

            // ✍ Step 2: Map the updated fields
            _mapper.Map(request, entity);

            // 💾 Step 3: Save changes
            await _dataService.SaveAsync(cancellationToken);

            return true;
        }
    }
}
