using AutoMapper;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Services;
using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit
{
    public class UpdateBusinessUnitCommandHandler:IRequestHandler<UpdateBusinessUnitCommand,int>
    {
        private readonly IDataService dataService;
        private readonly IGenerateBusinessUnitCodeService generateBusinessUnitCodeService;
        private readonly IMapper mapper;

        public UpdateBusinessUnitCommandHandler(IDataService dataService,IGenerateBusinessUnitCodeService generateBusinessUnitCode,IMapper mapper)
        {
            this.dataService = dataService; 
            this.generateBusinessUnitCodeService=generateBusinessUnitCode;
            this.mapper = mapper;
        }
        public async Task<int> Handle (UpdateBusinessUnitCommand command,CancellationToken cancellationtoken)
        {
            var businessUnit= dataService.BusinessUnits.Where(bu=>bu.Id==command.Id).FirstOrDefault();
            if (businessUnit == null)
                throw new Exception("unable to find business unit" );
            //The Below code handle regenration of Business Unit Code and ID of the selected business unit to be updated
            var updateCommand = mapper.Map<CreateBusinessUnitCommand>(command);
            var newBusinessUnitCode = await generateBusinessUnitCodeService.GenerateBusinessUnitCode(updateCommand, businessUnit.Id);
            businessUnit.BusinessUnitCode = newBusinessUnitCode.BusinessUnitCode;
            businessUnit.BusinessUnitID = newBusinessUnitCode.BusinessUnitId;

            businessUnit.Name = command.Name;
            businessUnit.ParentId = command.ParentId;
            businessUnit.Type = command.Type;
            businessUnit.StaffStrength= command.StaffStrength;
            if (businessUnit.ApprovalStatus == ApprovalStatus.Approved)
            {
                businessUnit.ApprovalStatus = ApprovalStatus.Approved;
            }
            else
            {
                businessUnit.ApprovalStatus = ApprovalStatus.Draft;
            }
            //  businessUnit.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await dataService.SaveAsync(cancellationtoken);

            return businessUnit.Id;

        }
    }
}
