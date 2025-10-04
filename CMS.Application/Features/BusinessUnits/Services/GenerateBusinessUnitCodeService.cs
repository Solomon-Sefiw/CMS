
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Models;
using CMS.Application.Features.BusinessUnits.Services;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Service.ValueConverterService;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.BusinessUnits.Services
{
    public class GenerateBusinessUnitCodeService : IGenerateBusinessUnitCodeService
    {
        private readonly IDataService dataService;
        private readonly IValueConvertor valueConvertor;

        public GenerateBusinessUnitCodeService(IDataService dataService, IValueConvertor valueConvertor)
        {
            this.dataService = dataService;
            this.valueConvertor = valueConvertor;
        }

        public async Task<BusinessUnitCodeGenerateDto> GenerateBusinessUnitCode(CreateBusinessUnitCommand request, int Id)
        {
            var businessUnitList = await dataService.BusinessUnits.ToListAsync();
            var parentBusinessUnit = businessUnitList.FirstOrDefault(bu => bu.Id == request.ParentId);

            var businessUnitTypes = await dataService.BusinessUnitTypes
                                                      .Where(but => but.IsActive)
                                                      .OrderBy(but => but.Order)
                                                      .ToListAsync();

            BusinessUnit existingBusinessUnit = null;
            if (Id != 0)
            {
                existingBusinessUnit = businessUnitList.FirstOrDefault(bu => bu.Id == Id);
            }

            var businessUnitCounts = GetBusinessUnitCounts(businessUnitList, businessUnitTypes, request.ParentId, existingBusinessUnit);

            var newBusinessUnitCodeInfo = new BusinessUnitCodeGenerateDto();

            var businessUnitType = businessUnitTypes.FirstOrDefault(but => but.Value == request.Type);

            if (businessUnitType == null)
            {
                throw new ArgumentException($"Unsupported business unit type: {request.Type}");
            }

            newBusinessUnitCodeInfo.BusinessUnitId = await GenerateBusinessUnitIdAsync(
                businessUnitType, businessUnitCounts, parentBusinessUnit, businessUnitList, businessUnitTypes, existingBusinessUnit, request);

            newBusinessUnitCodeInfo.BusinessUnitCode = businessUnitCounts[(int)request.Type].ToString("D" + businessUnitType.NumberOfDigits);

            return newBusinessUnitCodeInfo;
        }

        private async Task<string> GenerateBusinessUnitIdAsync(BusinessUnitType businessUnitType, Dictionary<int, int> businessUnitCounts,
            BusinessUnit parentBusinessUnit, List<BusinessUnit> businessUnitList, List<BusinessUnitType> businessUnitTypes,
            BusinessUnit? existingBusinessUnit, CreateBusinessUnitCommand request)
        {
            int orderLevel = businessUnitType.Order;

            List<string> parentCodes = new List<string>();
            BusinessUnit currentParent = parentBusinessUnit;

            // Collect parent codes up to orderLevel - 1 (hierarchy levels before current business unit)
            for (int i = 0; i < orderLevel - 1; i++)
            {
                if (currentParent == null || currentParent.Type == BusinessUnitTypeEnum.FederalSuperemeSeber)
                {
                    break;
                }
                parentCodes.Add(currentParent.BusinessUnitCode);
                currentParent = businessUnitList.FirstOrDefault(bu => bu.Id == currentParent.ParentId);
            }

            parentCodes.Reverse();

            // Calculate how many zero placeholders to insert between collected parents and current level
            int placeholdersNeeded = orderLevel - 1 - parentCodes.Count;

            for (int i = 0; i < placeholdersNeeded; i++)
            {
                int missingLevelIndex = i + parentCodes.Count;
                if (missingLevelIndex < businessUnitTypes.Count)
                {
                    var missingType = businessUnitTypes[missingLevelIndex];
                    string placeholder = new string('0', missingType.NumberOfDigits);
                    parentCodes.Add(placeholder);
                }
            }

            // Add current business unit's code with leading zeros
            parentCodes.Add(businessUnitCounts[(int)businessUnitType.Value].ToString("D" + businessUnitType.NumberOfDigits));

            // Add zero placeholders for deeper levels after current business unit
            int nextLevel = orderLevel;
            while (nextLevel < businessUnitTypes.Count)
            {
                var nextType = businessUnitTypes[nextLevel];
                string placeholder = new string('0', nextType.NumberOfDigits);
                parentCodes.Add(placeholder);
                nextLevel++;
            }

            string generatedCode = string.Join("-", parentCodes);
            return generatedCode;
        }

        private Dictionary<int, int> GetBusinessUnitCounts(List<BusinessUnit> businessUnitList,
                                                           List<BusinessUnitType> businessUnitTypes,
                                                           int parentId,
                                                           BusinessUnit existingBusinessUnit = null)
        {
            var counts = businessUnitTypes.ToDictionary(but => ((int)but.Value), but =>
            {
                int count = businessUnitList.Count(bu => bu.Type == but.Value && bu.ParentId == parentId);
                return count + 1;
            });

            return counts;
        }
    }
}
