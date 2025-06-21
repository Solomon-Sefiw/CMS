
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Service.ValueConverterService;
using CMS.Services.DataService;
using CMS.Application.Features.BusinessUnits.Models;
using CMS.Application.Features.BusinessUnits.Services;

using MediatR;
namespace CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit
{
    public class CreateBusinessUnitCommand : IRequest<int>
    {
        public string Name { get; set; }
        public int ParentId { get; set; }
        public BusinessUnitTypeEnum Type { get; set; }
        public int? StaffStrength { get; set; }
    }  


    //public record CreateBusinessUnitCommand(
    //    string Name
    //    , int ParentId, BusinessUnitTypeEnum Type, string AreaCode, int? SupervisorId, int? StaffStrength, string? ExpenseGL, string? IncomeGL) : IRequest<int>;

    public class CreateBusinessUnitCommandHandler : IRequestHandler<CreateBusinessUnitCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IValueConvertor valueConvertor;
        private readonly IGenerateBusinessUnitCodeService generateBusinessUnitCodeService;

        public CreateBusinessUnitCommandHandler(IDataService dataService, IValueConvertor valueConvertor, IGenerateBusinessUnitCodeService generateBusinessUnitCodeService)
        {
            this.dataService = dataService;
            this.valueConvertor = valueConvertor;
            this.generateBusinessUnitCodeService = generateBusinessUnitCodeService;
        }

        public async Task<int> Handle(CreateBusinessUnitCommand request, CancellationToken cancellationToken)
        {
            var businessUnitId = await generateBusinessUnitCodeService.GenerateBusinessUnitCode(request, 0);
           // var supervisor = await dataService.Employees.FirstOrDefaultAsync( x=>x.Id == request.SupervisorId);

            var businessUnit = new BusinessUnit()
            {
                BusinessUnitID = businessUnitId.BusinessUnitId,
                BusinessUnitCode = businessUnitId.BusinessUnitCode,
                Name = request.Name,
                ParentId = request.ParentId,
                Type = request.Type,
                StaffStrength = request.StaffStrength,
            };

            dataService.BusinessUnits.Add(businessUnit);
            await dataService.SaveAsync(cancellationToken);
            return businessUnit.Id;
        }

    }
}
