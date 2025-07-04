//using CMS.Persistance.DBContext;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;

//namespace CMS.Persistance.SPScripts
//{
//    public static class StoredProcedureRunner
//    {
//        public static async Task EnsureStoredProceduresCreatedAsync(CMSDBContext context, ILogger logger)
//        {
//            const string procedureName = "GetEmployeeChiefGroupCount";

//            var checkProcExists = $@"
//                IF NOT EXISTS (
//                    SELECT * FROM sys.objects 
//                    WHERE object_id = OBJECT_ID(N'[dbo].[{procedureName}]') 
//                    AND type IN (N'P', N'PC')
//                )
//                BEGIN
//                    EXEC('
//                        CREATE PROCEDURE {procedureName}
//                            @ActiveStatus INT,
//                            @ChiefOfficeType INT,
// @ApprovalStatus INT
//                        AS
//                        BEGIN
//                            SET NOCOUNT ON;

//                            WITH emp_bu AS (
//                                SELECT e.Id AS EmpId, e.BusinessUnitID AS BUId
//                                FROM Employees e
//                                WHERE e.EmployeeStatus = @ActiveStatus and e.ApprovalStatus=@ApprovalStatus
//                            ),
//                            recurse AS (
//                                SELECT 
//                                    eb.EmpId, 
//                                    bu.Id AS BUId, 
//                                    bu.Name, 
//                                    bu.Type, 
//                                    bu.ParentId,
//                                    CAST(CAST(bu.Id AS VARCHAR(MAX)) AS VARCHAR(MAX)) AS Path
//                                FROM emp_bu eb
//                                JOIN BusinessUnits bu ON eb.BUId = bu.Id

//                                UNION ALL

//                                SELECT 
//                                    r.EmpId, 
//                                    parent.Id, 
//                                    parent.Name, 
//                                    parent.Type, 
//                                    parent.ParentId,
//                                    r.Path + ''>'' + CAST(parent.Id AS VARCHAR(MAX))
//                                FROM recurse r
//                                JOIN BusinessUnits parent ON r.ParentId = parent.Id
//                                WHERE r.Type <> @ChiefOfficeType
//                                  AND CHARINDEX(CAST(parent.Id AS VARCHAR(MAX)), r.Path) = 0
//                            )
//                            SELECT 
//                                ISNULL(MAX(CASE WHEN Type = @ChiefOfficeType THEN Name END), ''Unknown Chief Office'') AS ChiefOfficeName,
//                                COUNT(DISTINCT EmpId) AS Employees
//                            FROM recurse
//                            GROUP BY EmpId
//                            OPTION (MAXRECURSION 0);
//                        END')
//                END
//            ";
//            try
//            {
//                await context.Database.ExecuteSqlRawAsync(checkProcExists);
//                logger.LogInformation("Stored procedure '{Procedure}' ensured.", procedureName);
//            }
//            catch (Exception ex)
//            {
//                logger.LogError(ex, "Error while creating stored procedure '{Procedure}'.", procedureName);
//            }
//        }
//    }
//}
