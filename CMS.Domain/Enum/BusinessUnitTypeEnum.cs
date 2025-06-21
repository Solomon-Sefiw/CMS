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
        //Bank=1,
        //ChiefOffice=2,
        //DepartmentorDistrict = 3,
        //Cluster = 4,
        //BranchorDivision = 5,
        //Section = 6,
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