using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum BusinessUnitTypeEnum
    {
        Unknown=0,
        FederalSupremeCourt ,
        FederalHighCourt,
        FederalFirstInstanceCourt,
        RegionalSupremeCourt,
        RegionalHighCourt,
        RegionalFirstInstanceCourt,
        ZonalCourt,
        WoredaOrSubCityCourt,
        CourtDivision,
        CourtSection

    }
}