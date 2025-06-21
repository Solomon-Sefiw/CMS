namespace CMS.Application.Security;

public class AuthPolicy
{
    //Employee Related Policy

    //user Related Policy
    public static class User
    {
        public const string canViewUser = "canViewUser";
        public const string canCreateUpdateUser = "canCreateUpdateUser";
        public const string canDisableUser = "canDisableUser";
        public const string canEnableUser = "canEnableUser";
    }
    //SetUp Related Policy
    public static class Setup
    {
        public const string canViewSetup = "canViewSetup";
        public const string canCreateUpdateSetup = "canCreateUpdateSetup";
        public const string canApproveRejectSetup = "canApproveRejectSetup";
        public const string canSubmitSetup = "canSubmitSetup";
        public const string canActivateSetup = "canActivateSetup";
        public const string canDeactivateSetup = "canDeactivateSetup";
    }
    //SetUp Related Policy
    public static class AddressAndContact
    {
        public const string canViewAddressAndContact = "canViewAddressAndContact"; 
        public const string canCreateUpdateAddressAndContact = "canCreateUpdateAddressAndContact";
        public const string canActivateAddressAndContact = "canActivateAddressAndContact";
        public const string canDeactivateAddressAndContact = "canDeactivateAddressAndContact";
    }
    public static class Dashboard
    {
        // Cards
        public const string canViewAllActiveEmployees = "canViewAllActiveEmployees";
        public const string canViewAllVacantJobs = "canViewAllVacantJobs";
        public const string canViewAllResignedEmployees = "canViewAllResignedEmployees";
        public const string canViewAllBusinessUnits = "canViewAllBusinessUnits";
        public const string canViewAllNewEmployees = "canViewAllNewEmployees";
        public const string canViewAllPositions = "canViewAllPositions";
        public const string canViewTurnoverRates = "canViewTurnoverRates";
        public const string canViewRetentionRates = "canViewRetentionRates";
        //Chart And Graph
        public const string canViewEmployeeDistributionByStatusDoughnutChart = "canViewEmployeeDistributionByStatusDoughnutChart";
        public const string canViewMonthlyNewEmployeesOfFiscalYearBarChart = "canViewMonthlyNewEmployeesOfFiscalYearBarChart";
        public const string canViewEmployeeDistributionByChiefOfficeBarChart = "canViewEmployeeDistributionByChiefOfficeBarChart";
        public const string canViewEmployeeDistributionByJobCategoryPieChart = "canViewEmployeeDistributionByJobCategoryPieChart";
        public const string canViewMonthlyHRMetricsLineGraph = "canViewMonthlyHRMetricsLineGraph";

        //Approval
        public const string canViewAllApprovalSummaries = "canViewAllApprovalSummaries";
        public const string canViewAllApprovalRequestGrid = "canViewAllApprovalRequestGrid";
    }

}
