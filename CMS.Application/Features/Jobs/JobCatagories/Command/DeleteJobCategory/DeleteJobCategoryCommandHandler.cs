using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.DeleteJobCatatagory
{
    public class DeleteJobCategoryCommandHandler:IRequestHandler<DeleteJobCategoryCommand, Result>
    {
        private readonly IDataService dataService;
        public DeleteJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<Result> Handle(DeleteJobCategoryCommand request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
                        .FirstOrDefaultAsync(j => j.Id == request.Id, cancellationToken);

            if (jobCategory == null)
                return Result.Failure("Job category not found.");

            if (jobCategory.IsActive )
                return Result.Failure("Cannot delete an approved job category or one associated with jobs.");

            dataService.JobCatagories.Remove(jobCategory);
            await dataService.SaveAsync(cancellationToken);

            return Result.Success("Job category deleted successfully.");
        }
    }

    public class Result
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }

        public static Result Success(string message = "") => new() { Succeeded = true, Message = message };
        public static Result Failure(string message = "") => new() { Succeeded = false, Message = message };
    }
}
