using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Services
{
    public interface IGenerateBusinessUnitCodeService
    {
        Task<BusinessUnitCodeGenerateDto> GenerateBusinessUnitCode(CreateBusinessUnitCommand request,int Id);
    }
}
