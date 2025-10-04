using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Identity;
using CMS.Domain.User;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Commands.CreateJudgeAssignment
{
    public class CreateJudgeAssignmentCommand : IRequest<int>
    {
        public int? CaseId { get; set; }
        public int? ChilotId { get; set; }
        public int? BusinessUnitId { get; set; }
    }

    public class CreateJudgeAssignmentCommandHandler : IRequestHandler<CreateJudgeAssignmentCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly UserManager<HRUser> _userManager;

        public CreateJudgeAssignmentCommandHandler(
            IDataService dataService,
            UserManager<HRUser> userManager)
        {
            _dataService = dataService;
            _userManager = userManager;
        }

        public async Task<int> Handle(CreateJudgeAssignmentCommand request, CancellationToken cancellationToken)
        {
            // Step 1️⃣: Get all Judges under the selected BusinessUnit
            var allJudges = await _userManager.Users
                .Where(u => u.BranchId == request.BusinessUnitId && !u.IsDeactivated)
                .ToListAsync(cancellationToken);

            var judgeList = new List<HRUser>();

            foreach (var user in allJudges)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Judge"))
                    judgeList.Add(user);
            }

            if (!judgeList.Any())
                throw new Exception("No available judges in this Business Unit.");

            // Step 2️⃣: Find the judge with the least number of assigned cases (fair distribution)
            var judgeAssignments = await _dataService.JudgeAssignments
                .Where(x => x.BusinessUnitId == request.BusinessUnitId)
                .ToListAsync(cancellationToken);

            var judgeLoad = judgeList
                .Select(j => new
                {
                    Judge = j,
                    Count = judgeAssignments.Count(a => a.JudgeId == j.Id)
                })
                .OrderBy(x => x.Count)
                .ToList();

            var selectedJudge = judgeLoad.First().Judge;

            // Step 3️⃣: Create the assignment
            var assignment = new Domain.Assignment.JudgeAssignment
            {
                JudgeId = selectedJudge.Id,
                CaseId = request.CaseId,
                ChilotId = request.ChilotId,
                BusinessUnitId = request.BusinessUnitId,
                Role = "Judge"
            };

            await _dataService.JudgeAssignments.AddAsync(assignment, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return assignment.Id;
        }
    }
}
