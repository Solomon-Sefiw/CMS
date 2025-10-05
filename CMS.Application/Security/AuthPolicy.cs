namespace CMS.Application.Security;

public class AuthPolicy
{
    //Employee Related Policy
    public static class Employee
    {
        public static class PersonalInfo{
            public const string canViewEmployeePersonalInfo = "canViewEmployeePersonalInfo";
            public const string canCreateUpdateEmployeePersonalInfo = "canCreateUpdateEmployeePersonalInfo";
            public const string canApproveRejectEmployeePersonalInfo = "canApproveRejectEmployeePersonalInfo";
            public const string canSubmitEmployeePersonalInfo = "canSubmitEmployeePersonalInfo";
            public const string canActivateEmployeePersonalInfo = "canActivateEmployeePersonalInfo";
            public const string canDeactivateEmployeePersonalInfo = "canDeactivateEmployeePersonalInfo";
        }
        public static class EmployeeId
        {
            public const string canViewEmployeeId = "canViewEmployeeId";
            public const string canCreateUpdateEmployeeId = "canCreateUpdateEmployeeId";
            public const string canApproveRejectEmployeeId = "canApproveRejectEmployeeId";
            public const string canSubmitEmployeeId = "canSubmitEmployeeId";
            public const string canGiveEmployeeId = "canGiveEmployeeId";
            public const string canReplaceEmployeeId = "canReplaceEmployeeId";
        }
        public static class Probation
        {
            public const string canViewEmployeeProbation = "canViewEmployeeProbation";
            public const string canApproveRejectEmployeeProbation = "canApproveRejectEmployeeProbation";
            public const string canSubmitEmployeeProbation = "canSubmitEmployeeProbation";
            public const string canTerminateEmployeeProbation = "canTerminateEmployeeProbation";
            public const string canActivateDeactivateEmployeeProbation = "canActivateDeactivateEmployeeProbation";
        }
        public static class EmployeeActivity
        {
            public const string canViewEmployeeActivity = "canViewEmployeeActivity";
            public const string canCreateUpdateEmployeeActivity = "canCreateUpdateEmployeeActivity";
            public const string canApproveRejectEmployeeActivity = "canApproveRejectEmployeeActivity";
            public const string canSubmitEmployeeActivity = "canSubmitEmployeeActivity";
            public const string canActivateEmployeeActivity = "canActivateEmployeeActivity";
            public const string canDeactivateEmployeeActivity = "canDeactivateEmployeeActivity";
        }

    }

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
    public static class Letter
    {
        public const string canViewLetter = "canViewLetter";
        public const string canCreateUpdateLetter = "canCreateUpdateLetter";
        public const string canApproveRejectLetter = "canApproveRejectLetter";
        public const string canSubmitLetter = "canSubmitLetter";
        public const string canActivateLetter = "canActivateLetter";
        public const string canDeactivateLetter = "canDeactivateLetter";
    }

    public static class Dashboard
    {
        public const string canViewLetterCountBoard = "canViewLetterCountBoard";
        public const string canViewRecentLettersBoard = "canViewRecentLettersBoard";
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
