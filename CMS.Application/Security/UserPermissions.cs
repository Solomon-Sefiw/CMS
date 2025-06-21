namespace CMS.Application.Security;

public class UserPermissions
{
    public static class Employee
    {
        public static class PersonalInfo
        {
            public const string View = "canViewEmployeePersonalInfo";
            public const string Edit = "canCreateUpdateEmployeePersonalInfo";
            public const string Approve = "canApproveRejectEmployeePersonalInfo";
            public const string Submit = "canSubmitEmployeePersonalInfo";
            public const string Activate = "canActivateEmployeePersonalInfo";
            public const string Deactivate = "canDeactivateEmployeePersonalInfo";
        }
        public static class EmployeeId
        {
            public const string View = "canViewEmployeeId";
            public const string Edit = "canCreateUpdateEmployeeId";
            public const string Approve = "canApproveRejectEmployeeId";
            public const string Submit = "canSubmitEmployeeId";
            public const string Give = "canGiveEmployeeId";
            public const string Replace = "canReplaceEmployeeId";
        }
        public static class Probation
        {
            public const string View = "canViewEmployeeProbation";
            public const string Approve = "canApproveRejectEmployeeProbation";
            public const string Submit = "canSubmitEmployeeProbation";
            public const string Terminate = "canTerminateEmployeeProbation";
            public const string Activate = "canActivateDeactivateEmployeeProbation";
        }
    }

    public static class User
    {
        public const string View = "canViewUser";
        public const string Edit = "canCreateUpdateUser";
        public const string Disable = "canDisableUser";
        public const string Enable = "canEnableUser";

    }

    public static class Setup   
    {
        public const string View = "canViewSetup";
        public const string Edit = "canCreateUpdateSetup";
        public const string Approve = "canApproveRejectSetup";
        public const string Submit = "canSubmitSetup";
        public const string Activate = "canActivateSetup";
        public const string Deactivate = "canDeactivateSetup";

    }
    public static class AddressAndContact
    {
        public const string View = "canViewAddressAndContact";
        public const string Edit = "canCreateUpdateAddressAndContact";
        public const string Activate = "canActivateAddressAndContact";
        public const string Deactivate = "canDeactivateAddressAndContact";
    }
    public static class Dashboard
    {
        // Cards
        public const string View = "canViewAllActiveEmployees";
        public const string View1 = "canViewAllVacantJobs";
        public const string View2 = "canViewAllResignedEmployees";
        public const string View3 = "canViewAllBusinessUnits";
        public const string View4 = "canViewAllNewEmployees";
        public const string View5 = "canViewAllPositions";
        public const string View6 = "canViewTurnoverRates";
        public const string View7 = "canViewRetentionRates";
        //Chart And Graph
        public const string View8 = "canViewEmployeeDistributionByStatusDoughnutChart";
        public const string View9 = "canViewMonthlyNewEmployeesOfFiscalYearBarChart";
        public const string View10 = "canViewEmployeeDistributionByChiefOfficeBarChart";
        public const string View11 = "canViewEmployeeDistributionByJobCategoryPieChart";
        public const string View12 = "canViewMonthlyHRMetricsLineGraph";

        //Approval
        public const string View13 = "canViewAllApprovalSummaries";
        public const string View14 = "canViewAllApprovalRequestGrid";
    }

    //public static class EmployeeMovement
    //{
    //    public static class LateralTransfer
    //    {
    //        public const string View = "canViewLateralTransfer";
    //        public const string CreateUpdate = "canCreateUpdateLateralTransfer";
    //    }

    //    public static class ActingAssignment
    //    {
    //        public const string View = "canViewActingAssignment";
    //        public const string CreateUpdate = "canCreateUpdateActingAssignment";
    //    }

    //    public static class Delegation
    //    {
    //        public const string View = "canViewDelegation";
    //        public const string CreateUpdate = "canCreateUpdateDelegation";
    //    }
    //}



}
