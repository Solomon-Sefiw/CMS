using CMS.Application.Features.Jobs.JobCatagories.Command.SubmitJobCatagory;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SubmitJobCategoryCommandHandler : IRequestHandler<SubmitJobCategoryCommand, int>
{
    private readonly IDataService dataService;

    public SubmitJobCategoryCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<int> Handle(SubmitJobCategoryCommand request, CancellationToken cancellationToken)
    {
        var jobCategory = await dataService.JobCatagories
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, cancellationToken);

        if (jobCategory == null)
            throw new KeyNotFoundException("Job category not found.");

        if (jobCategory.ApprovalStatus == ApprovalStatus.Approved)
            throw new InvalidOperationException("This job category is already approved.");
        if (jobCategory.ApprovalStatus == ApprovalStatus.Rejected)
            throw new InvalidOperationException("This job category is rejected and cannot be submitted.");

        if (jobCategory.ApprovalStatus == ApprovalStatus.Submitted)
            throw new InvalidOperationException("This job category is already submitted for approval.");
        jobCategory.ApprovalStatus = ApprovalStatus.Submitted;
        jobCategory.LastModifiedAt = DateTime.UtcNow;
        await dataService.SaveAsync(cancellationToken);

        return jobCategory.Id;
    }
}
