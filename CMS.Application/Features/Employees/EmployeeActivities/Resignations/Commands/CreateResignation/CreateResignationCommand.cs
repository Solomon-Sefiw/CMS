using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.CreateResignation
{
    public class CreateResignationCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public decimal Salary { get; set; }
        public string WorkUnit { get; set; } = string.Empty;
        public DateOnly ResignationDate { get; set; }
        public ResignationType ResignationType { get; set; }
        public string ReasonForResignation { get; set; } = string.Empty;
        public string FinalSettlementDetails { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class CreateResignationCommandHandler : IRequestHandler<CreateResignationCommand, int>
    {
        private readonly IDataService dataService;

        public CreateResignationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateResignationCommand request, CancellationToken cancellationToken)
        {
            var resignation = new Domain.Employee.EmployeeActivities.Resignation
            {
                EmployeeId = request.EmployeeId,
                Salary = request.Salary,
                WorkUnit = request.WorkUnit,
                ResignationDate = request.ResignationDate,
                ResignationType = request.ResignationType,
                ReasonForResignation = request.ReasonForResignation,
                FinalSettlementDetails = request.FinalSettlementDetails,
                IsActive = request.IsActive
            };

            dataService.Resignations.Add(resignation);
            await dataService.SaveAsync(cancellationToken);

            return resignation.Id;
        }
    }
}
