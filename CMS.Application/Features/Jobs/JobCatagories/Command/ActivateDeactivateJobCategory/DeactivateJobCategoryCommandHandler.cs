using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.ActivateDeactivateJobCatagory
{
    public class DeactivateJobCategoryCommandHandler : IRequestHandler<DeactivateJobCategoryCommand, int>
    {
        private readonly IDataService dataService;

        public DeactivateJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(DeactivateJobCategoryCommand request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, cancellationToken);

            if (jobCategory == null)
                throw new KeyNotFoundException("Active job category not found.");

              // Proceed to deactivate
            jobCategory.IsActive = false;
            jobCategory.LastModifiedAt = DateTime.UtcNow;

            await dataService.SaveAsync(cancellationToken);

            return jobCategory.Id;
        }
    }
}
