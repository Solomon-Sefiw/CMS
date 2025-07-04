//using CMS.Domain.Enum;
//using CMS.Domain.Enums;
//using CMS.Domain;
//using CMS.Services.DataService;
//using MediatR;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Data.SqlClient;

//namespace CMS.Application.Features.Dashboard.AnalyticsQueries
//{
//    public class GetEmployeeChiefGroupCountQueryHandler : IRequestHandler<GetEmployeeChiefGroupCountQuery, List<ChiefGroup>>
//    {
//        private readonly IDataService _dataService;
//        public GetEmployeeChiefGroupCountQueryHandler(IDataService dataService)
//        {
//            _dataService = dataService;
//        }
//        public async Task<List<ChiefGroup>> Handle(GetEmployeeChiefGroupCountQuery request, CancellationToken cancellationToken)
//        {
//            int activeStatus = (int)EmployeeStatusEnum.Active;
//            int chiefOfficeType = (int)BusinessUnitTypeEnum.ChiefOffice;
//            int approvalStatus = (int)ApprovalStatus.Approved;
//            var rawResults = await _dataService
//                .Set<ChiefGroupRaw>()
//                .FromSqlRaw("EXEC GetEmployeeChiefGroupCount @ActiveStatus, @ChiefOfficeType,@ApprovalStatus",
//                    new SqlParameter("@ActiveStatus", activeStatus),
//                    new SqlParameter("@ChiefOfficeType", chiefOfficeType),
//                    new SqlParameter("@ApprovalStatus", approvalStatus))
//                .AsNoTracking()
//                .ToListAsync(cancellationToken);

//            var employeesGroupedByChiefOffice = rawResults
//                .GroupBy(r => r.ChiefOfficeName)
//                .Select(g => new ChiefGroup(g.Key, g.Sum(r => r.Employees)))
//                .ToList();

//            return employeesGroupedByChiefOffice;
//        }


//    }
//}
