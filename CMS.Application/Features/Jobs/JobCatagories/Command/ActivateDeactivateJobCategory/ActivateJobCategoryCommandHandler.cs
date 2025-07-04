using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.ActivateDeactivateJobCatagory
{
   public class ActivateJobCategoryCommandHandler:IRequestHandler<ActivateJobCategoryCommand, int>
    {
        private readonly IDataService dataService;
        public ActivateJobCategoryCommandHandler(IDataService dataService) {
            this.dataService = dataService;

        }

        public async Task<int> Handle(ActivateJobCategoryCommand request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
            .FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsActive, cancellationToken);

            if (jobCategory == null)
                throw new KeyNotFoundException("Job category not found or already active.");

            // Optional: Deactivate others with same Value (if versioned)
            var others = await dataService.JobCatagories
                .Where(x => x.Id == jobCategory.Id && x.Id != request.Id && x.IsActive)
                .ToListAsync(cancellationToken);
            foreach (var other in others)
            {
                other.IsActive = false;
            }

            jobCategory.IsActive = true;
            jobCategory.LastModifiedAt = DateTime.UtcNow;

            await dataService.SaveAsync(cancellationToken);

            return jobCategory.Id;
        }
    }
    }
